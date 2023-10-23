# Quiz app 📄

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
or
```
npm install
npm run build
npm run start
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

Before using any JSON file, ensure its validity. JSON validation can be performed using tools like [JSON Formatter](https://jsonformatter.curiousconcept.com/).

### Single-Answer Questions (Format 1)

This JSON schema is designed for questions that allow only one correct answer.

```JSON
{
    "Question": "Example question with one correct option:",
    "isSingleChoice" : true, 
    "Answers": [
        {
            "text": "Correct",
            "isTrue": true
        },
        {
            "text": "Wrong 1",
            "isTrue": false
        },
        {
            "text": "Wrong 2"
        },
        {
            "text": "Wrong 3"
        }
    ]
}
```

#### Schema Details

- `Question`: Mandatory. The text of the question.
- `isSingleChoice`: Mandatory. This has to be set to `true`.
- `Answers`: Mandatory. An array of answer objects.
  - `text`: Mandatory. The text of the answer option.
  - `isTrue`: Optional, defaults to `false`. Should be set to `true` for the correct answer.

---

### Multiple-Answer Questions (Format 2)

This JSON schema is designed for questions that may have multiple correct answers.

```JSON
{
    "Question": "Example question with multiple correct options:",
    "isSingleChoice" : false, 
    "Answers": [
        {
            "text": "Correct 1",
            "isTrue": true
        },
        {
            "text": "Wrong 1"
        },
        {
            "text": "Correct 2",
            "isTrue": true
        },
        {
            "text": "Wrong 2",
            "isTrue": false
        }
    ]
}
```

#### Schema Details

- `Question`: Mandatory. The text of the question.
- `isSingleChoice`: Optional. If present, it has to be set to `false`.
- `Answers`: Mandatory. An array of answer objects.
  - `text`: Mandatory. The text of the answer option.
  - `isTrue`: Optional, defaults to `false`. Set to `true` for correct answers.

---

### Nested Questions (Format 3)

This JSON schema is designed for questions that have sub-questions, each with its own set of options.

```JSON
{
   "Question":"Example question with sub-questions:",
   "Answers":[
      {
         "text":"Question 1",
         "Options":[
            {
               "text":"Correct option",
               "isTrue":true
            },
            {
               "text":"Wrong option 1"
            },
            {
               "text":"Wrong option 2",
               "isTrue":false
            }
         ]
      },
      {
         "text":"Question 2",
         "Options":[
            {
               "text":"Correct option",
               "isTrue":true
            },
            {
               "text":"Wrong option 1"
            },
            {
               "text":"Wrong option 2"
            }
         ]
      },
      {
         "text":"Question 3",
         "Options":[
            {
               "text":"Correct option",
               "isTrue":true
            },
            {
               "text":"Wrong option 1",
               "isTrue":false
            },
            {
               "text":"Wrong option 2",
               "isTrue":false
            }
         ]
      }
   ]
}
```

#### Schema Details

- `Question`: Mandatory. The text of the main question.
- `Answers`: Mandatory. An array of sub-question objects.
  - `text`: Mandatory. The text for the sub-question.
  - `Options`: Mandatory. An array of answer objects for the sub-question.
    - `text`: Mandatory. The text of the answer option.
    - `isTrue`: Optional, defaults to `false`. Set to `true` for correct answers.