# Quiz app 📄

## Table of Contents 📜
- [General Info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Components](#components)
- [API Endpoints](#api-endpoints)
- [File Format for Questions](#file-format-for-questions)

## General Info ℹ️
This project is a quiz application built using Next.js.

## Technologies ⚙️
- Next.js
- React.js
- Tailwind CSS

## Setup 🔧
To run this project, you'll need Node.js and npm installed. Execute the following commands:

```
npm install
npm run dev
```

## Components 🏗️

### LoadingSpinner.js
This component displays a loading spinner during API calls or heavy computations.

### quiz/Index.js and quiz/Question.js
These are the core components of the quiz functionality.

### Header.js and Footer.js
These components represent the header and footer of the application.

### Layout.js
This component wraps around the main content, providing a consistent layout across different pages.

### _app.js
This is the main application file where global settings and configurations are defined.

## API Endpoints 📡

### quizFiles.js
This file contains the API endpoint for fetching quiz-related files.

## File Format for Questions 📝

Make sure to validate the `json` file before using it, you might use [this website](https://jsonformatter.curiousconcept.com/).

### Format 1

```JSON
{
    "Question": "",
    "Answers": [
        {
            "text": "",
            "isTrue": true
        },
        {
            "text": "",
            "isTrue": true
        },
        {
            "text": "",
            "isTrue": false
        }
    ]
}
```

### Format 2

```JSON
{
    "Question": ":",
    "Answers": [
        {
            "text": "",
            "Options": [
                {
                    "text": "",
                    "isTrue": false
                },
                {
                    "text": "",
                    "isTrue": false
                },
                {
                    "text": "",
                    "isTrue": true
                }
            ]
        },
        {
            "text": "",
            "Options": [
                {
                    "text": "",
                    "isTrue": true
                },
                {
                    "text": "",
                    "isTrue": false
                },
                {
                    "text": "",
                    "isTrue": false
                }
            ]
        },
        {
            "text": "",
            "Options": [
                {
                    "text": "",
                    "isTrue": false
                },
                {
                    "text": "",
                    "isTrue": false
                },
                {
                    "text": "",
                    "isTrue": true
                }
            ]
        }
    ]
}
```
