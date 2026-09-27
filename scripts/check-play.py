import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.snapchef_ai.twa"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

try:
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
    edit_id = edit['id']

    tracks = service.edits().tracks().list(packageName=PACKAGE_NAME, editId=edit_id).execute()
    print("Tracks for", PACKAGE_NAME)
    for t in tracks.get('tracks', []):
        print(f"Track: {t['track']}")
        for r in t.get('releases', []):
            print(f"  Release name: {r.get('name')}, status: {r.get('status')}, versionCodes: {r.get('versionCodes')}")

    service.edits().delete(packageName=PACKAGE_NAME, editId=edit_id).execute()
except Exception as e:
    print("Google Play API error:", e)
