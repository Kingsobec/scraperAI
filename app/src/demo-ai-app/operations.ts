import type { Task, GptResponse } from 'wasp/entities';
import type { GenerateGptResponse, CreateTask, DeleteTask, UpdateTask, GetGptResponses, GetAllTasksByUser } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { GeneratedSchedule } from './schedule';
import OpenAI from 'openai/index.mjs';

const openai = setupOpenAI();
function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return new HttpError(500, 'OpenAI API key is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

//#region Actions
type GptPayload = {
  hours: string;
};

export const generateGptResponse: GenerateGptResponse<GptPayload, GeneratedSchedule> = async ({ hours }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const tasks = await context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });

  const parsedTasks = tasks.map(({ description, time }) => ({
    description,
    time,
  }));

  try {
    // check if openai is initialized correctly with the API key
    if (openai instanceof Error) {
      throw openai;
    }

    if (
      !context.user.credits &&
      (!context.user.subscriptionStatus ||
        context.user.subscriptionStatus === 'deleted' ||
        context.user.subscriptionStatus === 'past_due')
    ) {
      throw new HttpError(402, 'User has not paid or is out of credits');
    } else if (context.user.credits && !context.user.subscriptionStatus) {
      console.log('decrementing credits');
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
    }

    // First GPT call: Generate subtasks
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `
            You are an expert AI course creator. You will be given a list of learning topics with the estimated time to complete each topic and the total hours the user has available for learning today.
            Your task is to break down each main topic into at least 3 detailed subtasks, considering the time allocated for each topic. Each subtask should directly contribute to making the user an expert on the topic.
            Keep the content concise, straight to the point, and impactful. No fluff. Each response should be formatted in clear steps for easy reading. The focus is on learning without wasting any time on extra text.`,
        },
        {
          role: 'user',
          content: `These are the topics I need to cover: ${JSON.stringify(
            parsedTasks
          )}. Please create a detailed learning schedule with specific lessons, the time required for each, and their priority.`,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'parseTopicsIntoLessons',
            description: 'Parses the day\'s topics and returns detailed course lessons for each topic.',
            parameters: {
              type: 'object',
              properties: {
                mainTasks: {
                  type: 'array',
                  description: 'List of main topics provided by the user, ordered by priority',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the main topic provided by the user',
                      },
                      priority: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        description: 'Task priority',
                      },
                    },
                  },
                },
                subtasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      description: {
                        type: 'string',
                        description:
                          'Detailed lessons that will help the user become an expert on the main topic, aligned to the time available.',
                      },
                      time: {
                        type: 'number',
                        description: 'Time allocated for the lesson in hours, e.g., 0.5',
                      },
                      mainTaskName: {
                        type: 'string',
                        description: 'Name of the main topic related to the lesson',
                      },
                    },
                  },
                },
              },
              required: ['mainTasks', 'subtasks', 'time', 'priority'],
            },
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'parseTopicsIntoLessons',
        },
      },
      temperature: 1,
    });

    const gptArgs = completion?.choices[0]?.message?.tool_calls?.[0]?.function.arguments;

    if (!gptArgs) {
      throw new HttpError(500, 'Bad response from OpenAI');
    }

    console.log('gpt function call arguments: ', gptArgs);

    const parsedSubtasks = JSON.parse(gptArgs).subtasks;
    const mainTasks = JSON.parse(gptArgs).mainTasks;

    // Second GPT call: Generate detailed course lessons for each subtask
    const detailedSubtasks = await Promise.all(
      parsedSubtasks.map(async (subtask: any) => {
        const detailedLessonCompletion = await openai.chat.completions.create({
          model: 'gpt-4o',
          max_tokens: 3000, // Reduced max tokens for detailed lesson generation
          messages: [
            {
              role: 'system',
              content: `
                You are an expert course creator. You will be given a specific learning subtask and the time available for it.
                Your task is to create a concise, step-by-step, and impactful course lesson that directly teaches the user how to accomplish the subtask.
                The lesson should be practical and actionable, focusing on doing rather than just explaining. Minimize fluff, and format the response in clear, easy-to-follow steps.`,
            },
            {
              role: 'user',
              content: `Subtask: ${subtask.description}. Please provide a concise, impactful course lesson.`,
            },
          ],
          temperature: 1,
        });

        const detailedLessonContent = detailedLessonCompletion?.choices[0]?.message?.content;

        return {
          ...subtask,
          description: detailedLessonContent || subtask.description, // Update the description with detailed content
        };
      })
    );

    const result: GeneratedSchedule = {
      mainTasks,
      subtasks: detailedSubtasks,
    };

    await context.entities.GptResponse.create({
      data: {
        user: { connect: { id: context.user.id } },
        content: JSON.stringify(result),
      },
    });

    return result;
  } catch (error: any) {
    if (!context.user.subscriptionStatus && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal server error';
    throw new HttpError(statusCode, errorMessage);
  }
};

export const createTask: CreateTask<Pick<Task, 'description'>, Task> = async ({ description }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.create({
    data: {
      description,
      user: { connect: { id: context.user.id } },
    },
  });

  return task;
};

export const updateTask: UpdateTask<Partial<Task>, Task> = async ({ id, isDone, time }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.update({
    where: {
      id,
    },
    data: {
      isDone,
      time,
    },
  });

  return task;
};

export const deleteTask: DeleteTask<Pick<Task, 'id'>, Task> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const task = await context.entities.Task.delete({
    where: {
      id,
    },
  });

  return task;
};
//#endregion

//#region Queries
export const getGptResponses: GetGptResponses<void, GptResponse[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.GptResponse.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};

export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
//#endregion
