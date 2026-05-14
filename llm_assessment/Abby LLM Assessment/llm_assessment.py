import json
import os
from sys import exit
import time

import pandas as pd
import requests


#DATA_PATH = "llm_assessment/messages.csv"
#PROMPT_PATH = "llm_assessment/prompt.txt"
DATA_PATH = "messages.csv"
PROMPT_PATH = "prompt.txt"
ENDPOINT_URL = "https://openrouter.ai/api/v1/chat/completions"


def load_data(filename):
    return pd.read_csv(filename)


def load_prompt(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return f.read().strip()


def create_message(global_prompt, patient_message, doctor_response):
    message = (
        f"Patient message:\n{patient_message}\n\nDoctor response:\n{doctor_response}"
    )
    return [
        {"role": "system", "content": global_prompt},
        {"role": "user", "content": message},
    ]


def call_api(
    message,
    model="meta-llama/llama-3.3-70b-instruct",
    user="user",
    api_key = None,
):
    api_key = api_key or os.environ.get("OPENROUTER_API_KEY", "")
    response = requests.post(
        url=ENDPOINT_URL,
        headers={"Authorization": f"Bearer {api_key}"},
        data=json.dumps(
            {
                "model": model,
                "messages": message,
            }
        ),
    )

    if response.status_code == 401:
        print(f"Row {i} failed with status code 401, remember to export API key.")
        exit()
    elif response.status_code == 429:
        print(
            f"Row {i} failed with status code {response.status_code}, waiting 60s and retrying"
        )
        time.sleep(60)
        response = requests.post(
            url=ENDPOINT_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            data=json.dumps(
                {
                    "model": model,
                    "messages": message,
                }
            ),
        )

    if not response.ok:
        print(f"Row {i} failed with status code {response.status_code}, quitting")
        exit()

    return response


if __name__ == "__main__":
    llm_responses = []

    print(f"Reading message data from {DATA_PATH}\nReading prompt from {PROMPT_PATH}\n")
    data = load_data(DATA_PATH)
    global_prompt = load_prompt(PROMPT_PATH)

    all = input("Do you want to generate on all rows? (y/n): ")
    model = input("Input model name (should be provider/model): ")

    for i, row in data.iterrows():
        message = create_message(
            global_prompt, row["patient_message"], row["doctor_response"]
        )
        response = call_api(message, model)

        message = response.json()["choices"][0]["message"]["content"]
        llm_responses.append(message)
        print(
            f"\nResponse for row {i} from model {response.json()['model']}:\n\n{message}\n"
        )

        if all.lower() != "y":
            exit()

    resp_length = len(llm_responses)
    data_length = data["patient_message"].count()

    if resp_length == data_length:
        data[model] = llm_responses
    else:
        print(
            f"Something went wrong, incorrect number of responses (Resp: {resp_length}, Data: {data_length})"
        )
        exit()

    data.to_csv("full_output.csv", index=False)
    data[model].to_csv("llm_output.csv", index=False)
