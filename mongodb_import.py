import pandas as pd
from pymongo import MongoClient

# MongoDB Atlas 연결
client = MongoClient('mongodb+srv://puzzle2:puzzle2@cluster0.3bfxg.mongodb.net/test?retryWrites=true&w=majority')
db = client['school']
collection = db['timetable2024second']

# CSV 파일 읽기
df = pd.read_csv('timetable.csv', encoding='utf-8')

# 열 이름 확인 및 필요시 변경
print("Current column names:", df.columns)
# 열 이름이 원하는 대로 되어 있지 않다면 아래 줄의 주석을 해제하고 수정하세요
# df.columns = ['Day', 'Period', 'Class_Location', 'Teacher_Name', 'Subject_Name']

# 데이터프레임을 딕셔너리 리스트로 변환
records = df.to_dict('records')

# MongoDB에 데이터 삽입
result = collection.insert_many(records)

print(f"{len(result.inserted_ids)} documents were successfully inserted.")

# 삽입된 데이터 확인 (선택사항)
print("\nSample of inserted data:")
for doc in collection.find().limit(5):
    print(doc)

# 연결 종료
client.close()