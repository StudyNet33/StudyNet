/**
 * STUDYNET — Core Application State & Client Router
 * CSIR NET Life Science Architecture
 */

// 1. Centralized Data Store
const STUDYNET_DATA = {
  subjects: [
    {
      id: 'biochemistry',
      unit: 'Unit 01',
      title: 'Biochemistry',
      status: 'active',
      description: 'Structure of atoms, molecules, chemical bonds, biomolecules, and metabolic pathways.',
      topicsCount: 8,
      lecturesCount: 1
    },
    {
      id: 'cell-biology',
      unit: 'Unit 02',
      title: 'Cell Biology',
      status: 'locked',
      description: 'Membrane structure, intracellular compartments, protein sorting, and cell division.',
      topicsCount: 6,
      lecturesCount: 0
    },
    {
      id: 'molecular-biology',
      unit: 'Unit 03',
      title: 'Molecular Biology',
      status: 'locked',
      description: 'DNA replication, repair, transcription, RNA processing, and translation mechanisms.',
      topicsCount: 7,
      lecturesCount: 0
    },
    {
      id: 'cell-communication',
      unit: 'Unit 04',
      title: 'Cell Communication & Signaling',
      status: 'locked',
      description: 'Host-parasite interaction, signaling pathways, and cancer biology.',
      topicsCount: 5,
      lecturesCount: 0
    },
    {
      id: 'plant-physiology',
      unit: 'Unit 06',
      title: 'Plant Physiology',
      status: 'locked',
      description: 'Photosynthesis, nitrogen metabolism, plant hormones, and secondary metabolites.',
      topicsCount: 6,
      lecturesCount: 0
    },
    {
      id: 'animal-physiology',
      unit: 'Unit 07',
      title: 'Animal Physiology',
      status: 'locked',
      description: 'Cardiovascular, respiratory, nervous, and endocrine systems.',
      topicsCount: 6,
      lecturesCount: 0
    },
    {
      id: 'genetics',
      unit: 'Unit 08',
      title: 'Genetics',
      status: 'locked',
      description: 'Mendelian principles, gene mapping, mutation, and chromosomal variations.',
      topicsCount: 5,
      lecturesCount: 0
    }
  ],

  // Real, structured lectures only (no dummy lectures)
  lectures: [
    {
      id: 'lec-01',
      lectureCode: 'Lecture 01',
      title: 'Amino Acid Chemistry',
      subjectId: 'biochemistry',
      subjectName: 'Biochemistry',
      chapter: 'Amino Acids',
      youtubeId: 'NobJaXZ3-1o',
      description: 'Comprehensive analysis of amino acid structures, standard and non-standard forms, stereochemistry, pKa values, zwitterion states, and calculation of Isoelectric Points (pI) critical for Part B & C numericals.',
      duration: '45 mins'
    }
  ]
};

// 2. Application State
const state = {
  currentView: 'home',
  activeLectureId: 'lec-01'
};

// 3. Router & View Transitions
function navigateTo(viewId) {
  state.currentView = viewId;

  // Toggle View Elements
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update Navigation Bar
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === viewId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Lecture Player Logic
function playLecture(lectureId) {
  const lecture = STUDYNET_DATA.lectures.find(l => l.id === lectureId);
  if (!lecture) return;

  state.activeLectureId = lectureId;

  // Update Iframe Embed
  const iframe = document.getElementById('player-iframe');
  iframe.src = `https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  // Update Details
  document.getElementById('player-lec-number').textContent = `${lecture.lectureCode} •${lecture.chapter}`;
  document.getElementById('player-lec-title').textContent = lecture.title;
  document.getElementById('player-lec-description').textContent = lecture.description;
  document.getElementById('player-subject-pill').textContent = lecture.subjectName;
  document.getElementById('player-chapter-pill').textContent = lecture.chapter;

  // Update Prev / Next Buttons
  const currentIndex = STUDYNET_DATA.lectures.findIndex(l => l.id === lectureId);
  const prevBtn = document.getElementById('btn-prev-lecture');
  const nextBtn = document.getElementById('btn-next-lecture');

  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= STUDYNET_DATA.lectures.length - 1;

  // Render Playlist Sidebar
  renderPlayerSidebar();

  // Navigate to player view
  navigateTo('player');
}

function navigateLecture(direction) {
  const currentIndex = STUDYNET_DATA.lectures.findIndex(l => l.id === state.activeLectureId);
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < STUDYNET_DATA.lectures.length) {
    playLecture(STUDYNET_DATA.lectures[nextIndex].id);
  }
}

// 5. Renderers

function renderSubjects() {
  const homeGrid = document.getElementById('home-subject-grid');
  const fullGrid = document.getElementById('full-subject-grid');

  const createCardHtml = (subject) => {
    const isActive = subject.status === 'active';
    return `
      <div class="subject-card ${isActive ? 'active' : 'locked'}" 
           onclick="${isActive ? "navigateTo('lectures')" : ''}">
        <div>
          <div class="subject-top">
            <span class="unit-number">${subject.unit}</span>
            <span class="badge-status ${isActive ? 'active' : 'coming-soon'}">
              ${isActive ? 'Active' : 'Coming Soon'}
            </span>
          </div>
          <h3 class="card-title">${subject.title}</h3>
          <p class="card-desc">${subject.description}</p>
        </div>
        <div class="subject-bottom">
          <span>${isActive ? `${subject.lecturesCount} Available Lecture` : 'In Development'}</span>
          <span>${isActive ? 'Enter &rarr;' : 'Locked'}</span>
        </div>
      </div>
    `;
  };

  const allCardsHtml = STUDYNET_DATA.subjects.map(createCardHtml).join('');
  if (homeGrid) homeGrid.innerHTML = allCardsHtml;
  if (fullGrid) fullGrid.innerHTML = allCardsHtml;
}

function renderLectures() {
  const homeList = document.getElementById('home-recent-lectures');
  const allList = document.getElementById('all-lectures-list');

  const rowsHtml = STUDYNET_DATA.lectures.map((lec, idx) => `
    <div class="lecture-row" onclick="playLecture('${lec.id}')">
      <div class="lecture-row-left">
        <span class="lecture-index">0${idx + 1}</span>
        <div>
          <span class="lecture-meta-name">${lec.title}</span>
          <span class="lecture-meta-sub">${lec.subjectName} &bull; ${lec.chapter}</span>
        </div>
      </div>
      <div class="lecture-row-action">
        <span>Watch Lecture</span>
        <span>&rarr;</span>
      </div>
    </div>
  `).join('');

  if (homeList) homeList.innerHTML = rowsHtml;
  if (allList) allList.innerHTML = rowsHtml;
}

function renderPlayerSidebar() {
  const playlistContainer = document.getElementById('player-playlist');
  const counter = document.getElementById('sidebar-counter');

  counter.textContent = `${STUDYNET_DATA.lectures.length} Lecture${STUDYNET_DATA.lectures.length > 1 ? 's' : ''}`;

  playlistContainer.innerHTML = STUDYNET_DATA.lectures.map((lec, idx) => {
    const isActive = lec.id === state.activeLectureId;
    return `
      <div class="playlist-item ${isActive ? 'active' : ''}" onclick="playLecture('${lec.id}')">
        <div class="playlist-item-top">
          <span>${lec.lectureCode}</span>
          <span>${lec.chapter}</span>
        </div>
        <div class="playlist-item-title">${lec.title}</div>
      </div>
    `;
  }).join('');
}

// 6. Bootstrap Initial State
document.addEventListener('DOMContentLoaded', () => {
  renderSubjects();
  renderLectures();
});
