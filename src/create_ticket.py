import requests 
import json
from requests.auth import HTTPBasicAuth

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

response = requests.request(
   "POST",
   url,
   data=payload,
   headers=headers,
   verify='https://github.com/nick-starr-kr/KR-DMP-Hackathon/blob/anusha/src/isrgrootx1.pem',
   auth=("anusha.chitranshi@gmail.com", "ATATT3xFfGF0zOik8FtVkmYdmER2JluIOm6sQKdvluIIBKXKTHFEEgHey9R2BJvqrPmHes1Xgr68VYGcWPY_IhcXQJVUreeramkVe6DL94Cskc0QxmFCm8aLcI2AHfJ-9pAMo3CT9eqnc0M7yoI9ZPTlQfvtmx2QL-Ms38aRd8Cz5BBLIKUvqG4=98F27A26")
)

print(json.dumps(json.loads(response.text), sort_keys=True, indent=4, separators=(",", ": ")))