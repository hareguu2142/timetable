let timetableData = [];

async function fetchTimetable() {
    const today = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const currentDay = days[today.getDay()];
    
    try {
        const response = await fetch(`/timetable/${currentDay}`);
        timetableData = await response.json();
    } catch (error) {
        console.error('Error fetching timetable:', error);
    }
}

function loadTeachers(period) {
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '';
    
    const teachersData = timetableData.filter(entry => entry.Period === period);
    
    teachersData.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry.Teacher_Name;
        
        if (entry['Class Location'] === '수업없음' && entry['Subject Name'] === '수업없음') {
            li.classList.add('no-class');
        }
        
        li.onclick = () => showClassInfo(period, entry.Teacher_Name);
        teacherList.appendChild(li);
    });
}

function showClassInfo(period, teacher) {
    const classInfo = document.getElementById('classInfo');
    const entry = timetableData.find(e => e.Period === period && e.Teacher_Name === teacher);
    
    if (entry) {
        if (entry['Class Location'] === '수업없음' && entry['Subject Name'] === '수업없음') {
            classInfo.innerHTML = `
                <strong>교사:</strong> ${entry.Teacher_Name}<br>
                <strong>상태:</strong> 수업 없음
            `;
        } else {
            classInfo.innerHTML = `
                <strong>교사:</strong> ${entry.Teacher_Name}<br>
                <strong>수업 장소:</strong> ${entry['Class Location']}<br>
                <strong>과목:</strong> ${entry['Subject Name']}
            `;
        }
    } else {
        classInfo.textContent = '정보를 찾을 수 없습니다.';
    }
}

// 페이지 로드 시 시간표 데이터 가져오기
fetchTimetable();