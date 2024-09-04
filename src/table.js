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

function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

async function initializePage() {
    showLoading();
    await fetchTimetable();
    hideLoading();
    
    // 여기에 초기 데이터 로드 및 화면 갱신 로직을 추가합니다.
    // 예: loadTeachers(1); // 1교시 데이터 로드
}

// 나머지 함수들은 그대로 유지...

// 페이지 로드 시 초기화 함수 호출
window.onload = initializePage;

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

// table.js 파일의 끝 부분에 다음 함수들을 추가합니다.

function setActivePeriod(period) {
    document.querySelectorAll('.periods button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`period${period}`).classList.add('active');
}

function setActiveTeacher(teacherName) {
    document.querySelectorAll('#teacherList li').forEach(li => {
        li.classList.remove('active');
    });
    const activeLi = Array.from(document.querySelectorAll('#teacherList li')).find(li => li.textContent === teacherName);
    if (activeLi) {
        activeLi.classList.add('active');
    }
}

// loadTeachers 함수를 다음과 같이 수정합니다.
function loadTeachers(period) {
    setActivePeriod(period);
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '';
    
    const teachersData = timetableData.filter(entry => entry.Period === period);
    
    teachersData.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry.Teacher_Name;
        
        if (entry['Class Location'] === '수업없음' && entry['Subject Name'] === '수업없음') {
            li.classList.add('no-class');
        }
        
        li.onclick = () => {
            showClassInfo(period, entry.Teacher_Name);
            setActiveTeacher(entry.Teacher_Name);
        };
        teacherList.appendChild(li);
    });
}

// initializePage 함수를 다음과 같이 수정합니다.
async function initializePage() {
    showLoading();
    await fetchTimetable();
    hideLoading();
    
    loadTeachers(1); // 1교시 데이터 로드
}