import { type Task } from 'wasp/entities';
import {
  generateGptResponse,
  deleteTask,
  updateTask,
  createTask,
  useQuery,
  getAllTasksByUser,
} from 'wasp/client/operations';
import { useState, useMemo } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { TiDelete } from 'react-icons/ti';
import type { GeneratedSchedule, MainTask, SubTask } from './schedule';
import { cn } from '../client/cn';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CoursePlannerPage() {
  return (
    <div className='py-16 lg:py-20 bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black from-[#f5f5f5] via-[#fff] to-gray-200 dark:text-white text-gray-900 min-h-screen transition-all duration-300'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-5xl font-bold tracking-tight dark:text-white'>
            <span className='text-yellow-500'>AI</span> Courses
          </h2>
          <p className='mt-6 text-lg leading-8 dark:text-gray-400 text-gray-700'>
            This powerful tool uses AI to help you create comprehensive courses on any topic. Enter your topics, and let
            AI craft the lessons!
          </p>

          {/* Help link section */}
          <div className='text-center mt-8'>
            <a
              href='https://docs.thenovakai.com/tools/demo-app/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-yellow-500 underline hover:text-yellow-600 font-semibold'
            >
              Need help? Read our docs on this tool
            </a>
            <p className='dark:text-gray-400 mt-2'>(Opens in a new tab for your convenience)</p>
          </div>
        </div>
        <div className='my-12 dark:bg-gray-800 bg-white rounded-3xl md:p-8 p-4 shadow-lg dark:border-none border border-yellow-500'>
          <NewLessonForm handleCreateTask={createTask} />
        </div>
      </div>
    </div>
  );
}

function NewLessonForm({ handleCreateTask }: { handleCreateTask: typeof createTask }) {
  const [description, setDescription] = useState<string>('');
  const [todaysHours, setTodaysHours] = useState<string>('8');
  const [response, setResponse] = useState<GeneratedSchedule | null>({
    mainTasks: [
      { name: 'Introduction to AI', priority: 'high' },
      { name: 'Learning WASP Framework', priority: 'medium' },
      { name: 'AI in Daily Tasks', priority: 'low' },
    ],
    subtasks: [
      { description: 'Overview of AI and its applications', time: 0.5, mainTaskName: 'Introduction to AI' },
      { description: 'Detailed exploration of AI techniques', time: 0.5, mainTaskName: 'Introduction to AI' },
      { description: 'Hands-on project: AI in a real-world scenario', time: 0.5, mainTaskName: 'Introduction to AI' },
      { description: 'Setting up the WASP environment', time: 0.5, mainTaskName: 'Learning WASP Framework' },
      { description: 'Building your first app with WASP', time: 1.5, mainTaskName: 'Learning WASP Framework' },
      { description: 'Integrating AI into WASP', time: 1, mainTaskName: 'Learning WASP Framework' },
      { description: 'Using AI for daily task automation', time: 0.5, mainTaskName: 'AI in Daily Tasks' },
      { description: 'Case studies of AI in personal productivity', time: 1, mainTaskName: 'AI in Daily Tasks' },
    ],
  });
  const [isPlanGenerating, setIsPlanGenerating] = useState<boolean>(false);
  const { data: tasks, isLoading: isTasksLoading } = useQuery(getAllTasksByUser);

  const handleSubmit = async () => {
    try {
      await handleCreateTask({ description });
      setDescription('');
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setIsPlanGenerating(true);
      const response = await generateGptResponse({ hours: todaysHours });
      if (response) {
        setResponse(response);
      }
    } catch (err: any) {
      window.alert('Error: ' + (err.message || 'Something went wrong'));
    } finally {
      setIsPlanGenerating(false);
    }
  };

  return (
    <div className='flex flex-col justify-center gap-10'>
      <div className='flex flex-col gap-3 w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto'>
        <div className='flex items-center justify-between gap-3'>
          <input
            type='text'
            id='description'
            className='text-sm dark:text-gray-300 w-full rounded-lg border dark:border-gray-600 border-yellow-500 dark:bg-gray-800 shadow-md focus:outline-none focus:border-transparent focus:shadow-lg duration-200 ease-in-out hover:shadow-lg p-3 break-words'
            placeholder='Enter lesson topic or task'
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <button
            type='button'
            onClick={handleSubmit}
            className='min-w-[7rem] font-medium text-gray-900 bg-yellow-500 shadow-lg ring-1 ring-inset ring-yellow-600 py-3 px-2 rounded-lg hover:bg-yellow-600 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-lg'
          >
            Add Lesson
          </button>
        </div>
      </div>

      <div className='space-y-10 w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto'>
        {isTasksLoading && <div>Loading...</div>}
        {tasks!! && tasks.length > 0 ? (
          <div className='space-y-6'>
            {tasks.map((task: Task) => (
              <Lesson key={task.id} id={task.id} isDone={task.isDone} description={task.description} time={task.time} />
            ))}
          </div>
        ) : (
          <div className='text-gray-400 text-center'>Add lessons to begin planning</div>
        )}
      </div>

      <div className='w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] mx-auto'>
        <button
          type='button'
          disabled={isPlanGenerating || tasks?.length === 0}
          onClick={() => handleGeneratePlan()}
          className='flex items-center justify-center min-w-[7rem] font-medium text-gray-900 bg-yellow-500 shadow-lg ring-1 ring-inset ring-yellow-600 py-3 px-5 rounded-lg hover:bg-yellow-600 duration-200 ease-in-out focus:outline-none focus:shadow-none hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {isPlanGenerating ? (
            <>
              <CgSpinner className='inline-block mr-2 animate-spin' />
              Generating...
            </>
          ) : (
            'Generate Course Plan'
          )}
        </button>
      </div>

      {!!response && (
        <div className='flex flex-col w-full'>
          <h3 className='text-lg font-semibold dark:text-gray-100 text-center text-gray-900'>Today's Course Plan</h3>

          <LessonTable schedule={response} />
        </div>
      )}
    </div>
  );
}

type LessonProps = Pick<Task, 'id' | 'isDone' | 'description' | 'time'>;

function Lesson({ id, isDone, description, time }: LessonProps) {
  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateTask({ id, isDone: e.currentTarget.checked });
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateTask({ id, time: e.currentTarget.value });
  };

  const handleDeleteClick = async () => {
    await deleteTask({ id });
  };

  return (
    <div className='flex items-center justify-between bg-gray-800 rounded-xl border border-gray-700 p-4 w-full shadow-lg'>
      <div className='flex items-center justify-between gap-5 w-full'>
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            className='ml-1 form-checkbox bg-yellow-500 checked:bg-yellow-300 rounded-lg border-yellow-600 duration-200 ease-in-out hover:bg-yellow-600 hover:checked:bg-yellow-600 focus:ring focus:ring-yellow-400 focus:checked:bg-yellow-500 focus:ring-opacity-50 w-6 h-6'
            checked={isDone}
            onChange={handleCheckboxChange}
          />
          <span
            className={cn('text-gray-300 text-lg break-words', {
              'line-through text-gray-500': isDone,
            })}
          >
            {description}
          </span>
        </div>
      </div>
      <div className='flex items-center justify-end w-15'>
        <button className='p-2' onClick={handleDeleteClick} title='Remove lesson'>
          <TiDelete size='24' className='text-red-600 hover:text-red-700' />
        </button>
      </div>
    </div>
  );
}

function LessonTable({ schedule }: { schedule: GeneratedSchedule }) {
  return (
    <div className='flex flex-col gap-6 py-6 w-full'>
      <table className='table-auto w-full border-separate border border-spacing-2 rounded-md dark:border-gray-600 shadow-lg'>
        {!!schedule.mainTasks ? (
          schedule.mainTasks
            .map((mainTask) => <MainTaskTable key={mainTask.name} mainTask={mainTask} subtasks={schedule.subtasks} />)
            .sort((a, b) => {
              const priorityOrder = ['low', 'medium', 'high'];
              if (a.props.mainTask.priority && b.props.mainTask.priority) {
                return (
                  priorityOrder.indexOf(b.props.mainTask.priority) - priorityOrder.indexOf(a.props.mainTask.priority)
                );
              } else {
                return 0;
              }
            })
        ) : (
          <div className='text-gray-400 text-center'>OpenAI didn't return any Main Tasks. Try again.</div>
        )}
      </table>
    </div>
  );
}

function MainTaskTable({ mainTask, subtasks }: { mainTask: MainTask; subtasks: SubTask[] }) {
  return (
    <>
      <thead>
        <tr>
          <th
            className={cn(
              'w-full flex items-center justify-between gap-5 py-6 px-4 text-gray-900 border rounded-lg border-gray-600 bg-opacity-70 text-xl',
              {
                'bg-red-200': mainTask.priority === 'high',
                'bg-green-200': mainTask.priority === 'low',
                'bg-yellow-200': mainTask.priority === 'medium',
              }
            )}
          >
            <span>{mainTask.name}</span>
            <span className='opacity-90 text-sm font-medium italic'>{mainTask.priority} priority</span>
          </th>
        </tr>
      </thead>
      {!!subtasks ? (
        subtasks.map((subtask) => {
          if (subtask.mainTaskName === mainTask.name) {
            return (
              <tbody key={subtask.description}>
                <tr>
                  <td
                    className={cn(
                      'w-full flex items-center justify-between gap-4 py-4 px-3 text-gray-900 border rounded-lg border-purple-200 bg-opacity-60 text-lg break-words',
                      {
                        'bg-red-100': mainTask.priority === 'high',
                        'bg-green-100': mainTask.priority === 'low',
                        'bg-yellow-100': mainTask.priority === 'medium',
                      }
                    )}
                  >
                    <SubtaskTable description={subtask.description} time={subtask.time} />
                  </td>
                </tr>
              </tbody>
            );
          }
        })
      ) : (
        <div className='text-gray-400 text-center'>OpenAI didn't return any Subtasks. Try again.</div>
      )}
    </>
  );
}

function SubtaskTable({ description, time }: { description: string; time: number }) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const convertHrsToMinutes = (time: number) => {
    if (time === 0) return 0;
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours > 0 ? hours + 'hr' : ''} ${minutes > 0 ? minutes + 'min' : ''}`;
  };

  const minutes = useMemo(() => convertHrsToMinutes(time), [time]);

  return (
    <>
      <input
        type='checkbox'
        className='ml-1 form-checkbox bg-yellow-500 checked:bg-yellow-300 rounded-lg border-yellow-600 duration-200 ease-in-out hover:bg-yellow-600 hover:checked:bg-yellow-600 focus:ring focus:ring-yellow-400 focus:checked:bg-yellow-500 focus:ring-opacity-50 w-6 h-6'
        checked={isDone}
        onChange={(e) => setIsDone(e.currentTarget.checked)}
      />
      <ReactMarkdown
        className={cn('leading-tight justify-self-start w-full text-gray-900 text-lg break-words', {
          'line-through text-gray-500 opacity-50': isDone,
        })}
        remarkPlugins={[remarkGfm]}
      >
        {description}
      </ReactMarkdown>
      <span
        className={cn('text-gray-700 text-right text-lg', {
          'line-through text-gray-900 opacity-50': isDone,
        })}
      >
        {minutes}
      </span>
    </>
  );
}