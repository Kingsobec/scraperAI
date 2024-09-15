import os

# Define the base path where the files should be created
base_path = "src/content/docs"

# Define the structure for directories and files with their initial content
file_structure = {
    
    "guides": {
        "for-leaders.md": "---\ntitle: \"AI Strategies for Leaders\"\ndescription: \"Practical guide for leaders on adopting AI strategies effectively.\"\n---\n\n...",
        "for-developers.md": "---\ntitle: \"Mastering AI Tools for Developers\"\ndescription: \"In-depth guide for developers to master AI tools and techniques, including prompt engineering.\"\n---\n\n...",
        "for-innovators.md": "---\ntitle: \"AI for Innovators\"\ndescription: \"Guide for creatives and innovators on leveraging AI for creativity and innovation.\"\n---\n\n..."
    },
    "learning-paths": {
        "fundamentals.md": "---\ntitle: \"AI Fundamentals\"\ndescription: \"Learn the basics of AI, tailored for beginners.\"\n---\n\n...",
        "intermediate.md": "---\ntitle: \"Intermediate AI\"\ndescription: \"Deepen your AI knowledge with intermediate-level concepts and practices.\"\n---\n\n...",
        "advanced.md": "---\ntitle: \"Advanced AI Practices\"\ndescription: \"Explore advanced AI topics and practices for seasoned professionals.\"\n---\n\n..."
    },
    "tools": {
        "ai-tools.md": "---\ntitle: \"AI Tools and Platforms\"\ndescription: \"A curated list of recommended AI tools and platforms.\"\n---\n\n...",
        "favorite-links.md": "---\ntitle: \"Favorite AI Links\"\ndescription: \"A collection of useful AI-related links to resources, tools, and communities.\"\n---\n\n...",
        "community.md": "---\ntitle: \"AI Community Resources\"\ndescription: \"Information about resources and networks for AI professionals.\"\n---\n\n...",
        "cheatsheets.md": "---\ntitle: \"Cheatsheets and Checklists\"\ndescription: \"Quick reference guides for various AI tasks.\"\n---\n\n..."
    },
    "case-studies": {
        "leadership.md": "---\ntitle: \"Leadership in AI\"\ndescription: \"Case studies on successful AI implementation by leaders.\"\n---\n\n...",
        "developer-spotlight.md": "---\ntitle: \"Developer Spotlight\"\ndescription: \"Highlight of developers who have excelled using AI.\"\n---\n\n..."
    },
    "additional": {
        "books.md": "---\ntitle: \"Recommended Books on AI\"\ndescription: \"List of must-read books on AI and related subjects.\"\n---\n\n...",
        "videos.md": "---\ntitle: \"AI Videos and Webinars\"\ndescription: \"Curated videos and webinars on various AI topics.\"\n---\n\n...",
        "faq.md": "---\ntitle: \"Frequently Asked Questions (FAQ)\"\ndescription: \"Answers to common questions about AI, our platform, and services.\"\n---\n\n..."
    }
}

# Function to create directories and files
def create_files(base_path, file_structure):
    for folder, files in file_structure.items():
        # Create each directory
        dir_path = os.path.join(base_path, folder)
        os.makedirs(dir_path, exist_ok=True)
        for filename, content in files.items():
            # Create each file with its initial content
            file_path = os.path.join(dir_path, filename)
            with open(file_path, 'w') as file:
                file.write(content)
            print(f"Created: {file_path}")

# Run the function
create_files(base_path, file_structure)