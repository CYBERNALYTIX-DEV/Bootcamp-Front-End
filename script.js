const icon = document.querySelector('.menu');
const dropdown = document.querySelector('.drop-down');

function openMenu() {
  dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex';
  dropdown.classList.toggle('show');
  if (dropdown.classList.contains('show')) {
    icon.src = 'images/close-nav.svg';
  } else {
    icon.src = 'images/menu.svg'
  }
}

// Close dropdown when any nav link is clicked
document.querySelectorAll('.drop-down a').forEach(link => {
  link.addEventListener('click', () => {
    dropdown.classList.remove('show');
    icon.src = 'images/menu.svg';
  });
});

// Close dropdown when clicking outside menu
document.addEventListener('click', (event) => {
  const clickedInsideMenu = dropdown.contains(event.target);
  const clickedMenuIcon = icon.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuIcon && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
    icon.src = 'images/menu.svg';
  }
});

// Form logic
const form = document.getElementById("bootcamp-form");
if (form) {
  const experienceRadios = form.querySelectorAll("input[name='hasExperience']");
  const experienceDetail = document.getElementById("experience-details");
  const experienceTextarea = document.getElementById("experience-detail");

  experienceRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes" && radio.checked) {
        experienceDetail.style.display = "block";
        experienceTextarea.setAttribute("required", "required");
      } else if (radio.value === "no" && radio.checked) {
        experienceDetail.style.display = "none";
        experienceTextarea.removeAttribute("required");
        experienceTextarea.value = "";
        experienceTextarea.style.borderColor = "";
      }
    });
  });

  form.addEventListener("submit", function (e) {
    let valid = true;
    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach(field => {
      if (field.offsetParent === null) return;

      if (!field.value.trim()) {
        field.style.borderColor = "red";
        valid = false;
      } else {
        field.style.borderColor = "#2d4a8a";
      }
    });

    // Validate 100-word minimum for textarea(s) with class 'word-count'
    const wordCountAreas = form.querySelectorAll("textarea.word-count, textarea[data-minwords]");
    wordCountAreas.forEach(area => {
      const words = area.value.trim().split(/\s+/).filter(Boolean);
      if (words.length < 100) {
        area.style.borderColor = "red";
        valid = false;
      } else {
        area.style.borderColor = "#2d4a8a";
      }
    });

    if (!valid) {
      e.preventDefault();
      // alert("Please write at least 100 words in the required textarea(s)." );
      return;
    }

    // Select all fields you want to monitor
    const fields = form.querySelectorAll("input, textarea, select");

    fields.forEach(field => {
      field.addEventListener("input", () => {
        if (field.value.trim() !== "") {
          field.style.borderColor = ""; // remove red
        }

        // For the 100-word textareas only
        if (field.id === "message1" || field.id === "message2") {
          const wordCount = field.value.trim().split(/\s+/).filter(Boolean).length;
          if (wordCount >= 100) {
            field.style.borderColor = ""; // remove red when 100 words reached
          }
        }
      });

      if (field.tagName.toLowerCase() === "select") {
        field.addEventListener("change", () => {
          if (field.value !== "") {
            field.style.borderColor = "";
          }
        });
      }
    });

    // If valid, log data and show alert
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Submitted Data', data);
    const successBox = document.getElementById("form-success");
    successBox.style.display = "block";
    successBox.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    setTimeout(() => {
      successBox.style.display = "none";
    }, 5000);
    form.reset();
    if (experienceDetail) experienceDetail.style.display = "none";
  });

  const focusable = Array.from(
    form.querySelectorAll("input, select, textarea, button")
  ).filter(el => !el.disabled && el.type !== "hidden");

  // Handle Enter key
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const current = document.activeElement;
      const index = focusable.indexOf(current);

      // For textarea: allow Enter if it's multi-line
      if (current.tagName.toLowerCase() === "textarea") {
        return; // Let it insert new line
      }

      // Prevent default form submit for now
      e.preventDefault();

      if (index >= 0 && index < focusable.length - 1) {
        focusable[index + 1].focus(); // Move to next field
      } else {
        form.requestSubmit(); // Submit form if it's the last field
      }
    }
  });
}