# AI-Driven Data Aggregation & Alerting Pipeline (n8n)

<img width="1407" height="538" alt="image" src="https://github.com/user-attachments/assets/02939260-e420-43ec-ad23-539249dac899" />

A serverless, automated data pipeline built to aggregate, process, and deliver daily tech and financial intelligence. 

As a Site Reliability Engineer expanding my automation toolkit, this project serves as my first deep dive into **n8n** and **AI-driven workflows**. The goal was to build a highly reliable microservice that not only utilizes LLMs for data processing but strictly adheres to production-grade API limits and self-monitoring observability practices.

## 🏗️ Architecture & Flow

This pipeline runs continuously on a self-hosted Proxmox environment.

1. **Ingestion:** Pulls daily data from multiple IT, tech, and finance RSS feeds.
2. **AI Processing:** Leverages the **Google Gemini API** to filter the top 50 critical stories, translate regional content into English, and generate one-sentence executive summaries.
3. **Load Balancing / Chunking:** Uses custom JavaScript to parse the LLM output and chunk the 50 articles into 5 distinct, API-compliant batches.
4. **Delivery:** Pushes the formatted HTML batches directly to a custom Telegram Bot.

## 🚀 Key SRE & Reliability Features

Building a bot is easy; making it reliable is hard. This project implements several SRE best practices to ensure zero silent failures:

* **API Rate Limit Handling:** Telegram aggressively rate-limits messages. The custom `telegram-chunking.js` script batches the LLM output to strictly comply with payload size limits (4096 characters) and burst limits, completely avoiding `HTTP 429: Too Many Requests` errors.
* **Automated Retries:** Integrated exponential backoff and retry mechanisms on the Gemini API node to seamlessly handle temporary Google server timeouts.
* **Out-of-Band Error Alerting:** Built a secondary, parallel n8n workflow (`error-alert-workflow.json`) acting as a dead-letter queue. If any node in the primary pipeline crashes, this workflow intercepts the system error and pushes a real-time `🚨 Workflow Failed` diagnostic alert to my phone.

## 📂 Repository Contents

* `main-news-workflow.json`: The primary n8n workflow export.
* `error-alert-workflow.json`: The dedicated monitoring and alerting workflow.
* `telegram-chunking.js`: The JavaScript logic used within the n8n Code Node to parse the LLM payload and prepare API-compliant chunks.

## 🛠️ Tech Stack
* **Platform:** n8n (Self-hosted via Docker/Proxmox)
* **AI/LLM:** Google Gemini API
* **Scripting:** Node.js / JavaScript
* **Delivery:** Telegram Bot API
* **Concepts:** Observability, Rate Limiting, JSON Parsing, API Integration
