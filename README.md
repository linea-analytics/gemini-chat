# Gemini Chat <img src="public/img/logo.png" align="right" width="120" style="border-radius:15px"/>


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

A simple chat application using the [Gemini API](https://ai.google.dev/) (gemini-2.0-flash) with support for conversation history.

## 🚀 Live Demo
You can try the live app [here](url)

## 📦 Prerequisites
To run the app locally, you'll need:

- Git – [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

- Node.js (with npm) – [Install Node.js](https://nodejs.org/en)

## 🛠 Setup Instructions
1. Clone the repository:

```bash
git clone https://github.com/your-username/gemini-chat.git
cd gemini-chat
```
2. Install dependencies:

```bash
npm install
```

3. Set up your Gemini API key:

- Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a `.env` file in the root directory and add the following:

```env
GEMINI_API_KEY=your_api_key_here
```

🔒 Never share your API key publicly or commit it to version control.

## ⚙️ Configuration
The app uses environment variables to keep secrets secure. All configurable values are stored in the `.env` file.

## 🧠 How It Works
- **Backend:** A simple Node.js + Express server handles requests and routes.

- **AI Integration:** Uses `@google/generative-ai` to make calls to the Gemini 2.0 Flash model, which comes with a [generous free tier](https://ai.google.dev/gemini-api/docs/pricing).

- **Frontend:** A lightweight HTML interface styled with Bulma CSS.

- **Conversation History:** Messages are stored in memory per session, enabling back-and-forth chat.

## 🏢 About
This open-source project is offered by [Linea Analytics](https://linea-analytics.com/).

📢 Follow us on [LinkedIn](https://www.linkedin.com/company/86720046/admin/dashboard/) for more open-source tools, marketing science insights, and AI-powered solutions.

## 📄 License
This project is licensed under the MIT License. See LICENSE for more details.

