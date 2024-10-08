import os
import json
import requests
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth

load_dotenv()
email = os.getenv('ATLASSIAN_EMAIL')
api_token = os.getenv('ATLASSIAN_API_TOKEN')

url = "https://anushachitranshi.atlassian.net/rest/api/2/issue"


headers = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}

payload = json.dumps( {
  "fields": {
        "project": {
           "key": "SCRUM"
        },
        "issueType": {
            "name": "Task"
        },
        "assignee": {
        "id": "5b109f2e9729b51b54dc274d"
        },
        "project": {
        "id": "10000"
        },
        "reporter": {
        "id": "5b10a2844c20165700ede21g"
        },
    },
    "update": {
        "worklog": [
        {
            "add": {
            "started": "2019-07-05T11:05:00.000+0000",
            "timeSpent": "60m"
            }
        }
        ]
  }
} )

auth = HTTPBasicAuth(email, api_token)

response = requests.post(
   url,
   data=payload,
   headers=headers,
   auth=auth,
   verify=r"C:\Users\ac39920\AppData\Local\Programs\Python\Python313\Lib\site-packages\certifi\cacert.pem"
)

print(response.text)