import fs from 'fs';
import path from 'path';
import xss from 'xss';

// You may use a more robust solution for sanitization.
const sanitizeData = (data) => {
  return xss(data);
};

export default async function handler(req, res) {

  if (req.method === 'POST') {
    try {
      const { name, questions } = req.body;

      // Validate and sanitize 'name'
      if (!name || typeof name !== 'string' || !/^[A-Za-z0-9_]+$/.test(name)) {
        return res.status(400).json({ error: 'Invalid or malicious name' });
      }

      // Validate and sanitize 'questions'
      if (!Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid questions' });
      }

      
      const sanitizedName = sanitizeData(name);

      const sanitizedQuestions = questions.map((question) => {
        return {
          Question: sanitizeData(question.Question),
          isSingleChoice: Boolean(question.isSingleChoice),
          Answers: question.Answers.map((answer) => {
            return {
              text: sanitizeData(answer.text),
              isTrue: Boolean(answer.isTrue),
            };
          }),
        };
      });

      // Create a JSON object
      const data = JSON.stringify(
        sanitizedQuestions
      );

      const filePath = path.join(process.cwd(), 'public', 'quizJson', `${sanitizedName}.json`);
      fs.writeFileSync(filePath, data);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
