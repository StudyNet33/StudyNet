const lectures = [
  {
    id: "NobJaXZ3-1o",
    title: "Amino Acid Chemistry",
    description: "Biochemistry — Amino Acid Chemistry"
  }
];

let current = 0;

const frame = document.getElementById("videoFrame");
const title = document.getElementById("videoTitle");
const description = document.getElementById("videoDescription");
const list = document.getElementById("lectureList");
const count = document.getElementById("lectureCount");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");

count.textContent = lectures.length;

function renderList() {
  list.innerHTML = lectures.map((lecture, index) => `
    <button class="lecture-item ${index === current ? "active" : ""}" data-index="${index}">
      <div class="lecture-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <div class="lecture-name">${lecture.title}</div>
        <div class="lecture-meta">Lecture ${String(index + 1).padStart(2, "0")}</div>
      </div>
    </button>
  `).join("");

  document.querySelectorAll(".lecture-item").forEach(btn => {
    btn.addEventListener("click", () => selectLecture(Number(btn.dataset.index)));
  });
}

function selectLecture(index) {
  current = index;
  const lecture = lectures[current];
  frame.src = `https://www.youtube.com/embed/${lecture.id}?rel=0&modestbranding=1`;
  frame.title = lecture.title;
  title.textContent = lecture.title;
  description.textContent = lecture.description;
  prev.classList.toggle("disabled", current === 0);
  next.classList.toggle("disabled", current === lectures.length - 1);
  renderList();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

prev.addEventListener("click", () => {
  if (current > 0) selectLecture(current - 1);
});
next.addEventListener("click", () => {
  if (current < lectures.length - 1) selectLecture(current + 1);
});

renderList();

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
