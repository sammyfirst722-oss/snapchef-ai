import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.snapchef_ai.twa"
AAB_PATH = r"C:\Users\sammy\snapchef-twa\app\build\outputs\bundle\release\app-release.aab"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

try:
    print("Authenticating with Google Play Publisher API...")
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    print("Creating new edit for", PACKAGE_NAME)
    edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
    edit_id = edit['id']
    print("Edit ID:", edit_id)

    print(f"Uploading new AAB Bundle 6: {AAB_PATH} ({os.path.getsize(AAB_PATH)} bytes)...")
    media = MediaFileUpload(AAB_PATH, mimetype='application/octet-stream', resumable=True)
    bundle_resp = service.edits().bundles().upload(packageName=PACKAGE_NAME, editId=edit_id, media_body=media).execute()
    vc = bundle_resp['versionCode']
    print(f"✅ Successfully uploaded bundle! Version Code: {vc}")

    print("Updating production track release...")
    track_body = {
        'track': 'production',
        'releases': [
            {
                'name': f'1.0.5 ({vc})',
                'versionCodes': [str(vc)],
                'status': 'completed',
                'releaseNotes': [
                    {
                        'language': 'en-US',
                        'text': 'Adds 1-click Instacart, Walmart Fresh, and Amazon Fresh grocery delivery carts, verified authentic recipe photos, and Google Play billing compliance.'
                    }
                ]
            }
        ]
    }

    service.edits().tracks().update(packageName=PACKAGE_NAME, editId=edit_id, track='production', body=track_body).execute()
    print("Committing edit to Google Play Console...")
    commit_resp = service.edits().commit(packageName=PACKAGE_NAME, editId=edit_id).execute()
    print("✅ Edit committed successfully! Release 1.0.5 (6) is officially submitted on Google Play Production track!")

except Exception as e:
    print("❌ Error uploading to Google Play:", e)
