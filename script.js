const icon = document.querySelector(".menu");
const dropdown = document.querySelector(".drop-down");

function openMenu() {
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
  dropdown.classList.toggle("show");
  if (dropdown.classList.contains("show")) {
    icon.src = "images/close-nav.svg";
  } else {
    icon.src = "images/menu.svg";
  }
}

// Close dropdown when any nav link is clicked
document.querySelectorAll(".drop-down a").forEach((link) => {
  link.addEventListener("click", () => {
    dropdown.classList.remove("show");
    icon.src = "images/menu.svg";
  });
});

// Close dropdown when clicking outside menu
document.addEventListener("click", (event) => {
  const clickedInsideMenu = dropdown.contains(event.target);
  const clickedMenuIcon = icon.contains(event.target);

  if (
    !clickedInsideMenu &&
    !clickedMenuIcon &&
    dropdown.classList.contains("show")
  ) {
    dropdown.classList.remove("show");
    icon.src = "images/menu.svg";
  }
});

// Helper function to count words
function countWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

// Helper function to show word count feedback
function showWordCountFeedback(textarea, wordCount, minWords = 100) {
  let feedbackElement = textarea.nextElementSibling;

  // Check if the next element is already our feedback element
  if (
    !feedbackElement ||
    !feedbackElement.classList.contains("word-count-feedback")
  ) {
    feedbackElement = document.createElement("div");
    feedbackElement.className = "word-count-feedback";
    feedbackElement.style.fontSize = "0.8rem";
    feedbackElement.style.marginTop = "5px";
    feedbackElement.style.marginBottom = "15px";

    // Insert the feedback element right after the textarea
    textarea.parentNode.insertBefore(feedbackElement, textarea.nextSibling);
  }

  if (wordCount < minWords) {
    feedbackElement.textContent = `You have ${wordCount}/${minWords} words... (minimum ${minWords} words required)`;
    feedbackElement.style.color = "red";
    return false;
  } else {
    feedbackElement.textContent = `You have ${wordCount}/${minWords} words ✓`;
    feedbackElement.style.color = "green";
    return true;
  }
}

// Form logic
const form = document.getElementById("bootcamp-form");
if (form) {
  const experienceRadios = form.querySelectorAll("input[name='hasExperience']");
  const experienceDetail = document.getElementById("experience-details");
  const experienceTextarea = document.getElementById("experience-detail");

  experienceRadios.forEach((radio) => {
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

  // Real-time validation and word counting for input fields
  const fields = form.querySelectorAll("input, textarea, select");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim() !== "") {
        field.style.borderColor = "";
      }

      // For the 100-word textareas only
      if (field.id === "message1" || field.id === "message2") {
        const wordCount = countWords(field.value);
        showWordCountFeedback(field, wordCount, 100);

        if (wordCount >= 100) {
          field.style.borderColor = "";
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

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let valid = true;
    let errorMessages = [];

    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (field.offsetParent === null) return;

      if (!field.value.trim()) {
        field.style.borderColor = "red";
        valid = false;
      } else {
        field.style.borderColor = "#2d4a8a";
      }
    });

    // Validate 100-word minimum for motivation and expectation textareas
    const motivationField = document.getElementById("message1");
    const expectationField = document.getElementById("message2");

    if (motivationField) {
      const motivationWordCount = countWords(motivationField.value);
      if (motivationWordCount < 100) {
        motivationField.style.borderColor = "red";
        showWordCountFeedback(motivationField, motivationWordCount, 100);
        errorMessages.push(
          `Motivation field requires at least 100 words! You have ${motivationWordCount} words.`
        );
        valid = false;
      } else {
        motivationField.style.borderColor = "#2d4a8a";
        showWordCountFeedback(motivationField, motivationWordCount, 100);
      }
    }

    if (expectationField) {
      const expectationWordCount = countWords(expectationField.value);
      if (expectationWordCount < 100) {
        expectationField.style.borderColor = "red";
        showWordCountFeedback(expectationField, expectationWordCount, 100);
        errorMessages.push(
          `Goals field requires at least 100 words! You have ${expectationWordCount} words.`
        );
        valid = false;
      } else {
        expectationField.style.borderColor = "#2d4a8a";
        showWordCountFeedback(expectationField, expectationWordCount, 100);
      }
    }

    if (!valid) {
      if (errorMessages.length > 0) {
        alert(errorMessages.join("\n\n"));
      }
      return;
    }

    // Prepare form data for submission
    const formData = new FormData(form);
    const data = {
      fullName: formData.get("fullName"),
      tel: formData.get("tel"),
      email: formData.get("email"),
      gender: formData.get("gender"),
      residence: formData.get("residence"),
      currentEngagement: formData.get("currentEngagement"),
      currentField: formData.get("currentField"),
      proficiency: formData.get("proficiency"),
      motivation: formData.get("motivation"),
      expectation: formData.get("expectation"),
      hasExperience: formData.get("hasExperience"),
      experience: formData.get("experience") || "",
      referer: formData.get("referer"),
      session: formData.get("session"),
      certificate: formData.get("certificate"),
    };

    // Disable submit button during request
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const response = await fetch(
        "https://bootcamp-backend-t96p.onrender.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Show success message
        const successBox = document.getElementById("form-success");
        successBox.style.display = "block";
        successBox.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Reset form and hide experience details
        form.reset();
        if (experienceDetail) experienceDetail.style.display = "none";

        // Clear word count feedback
        document
          .querySelectorAll(".word-count-feedback")
          .forEach((el) => el.remove());

        // Hide success message after 5 seconds
        setTimeout(() => {
          successBox.style.display = "none";
        }, 5000);
      } else {
        // Handle specific error messages from backend
        if (response.status === 409) {
          alert(
            "This email is already registered! Please use a different email address"
          );
        } else {
          alert(result.message || "Registration failed! Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error! Please check your connection and try again.");
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

  // Handle Enter key navigation
  const focusable = Array.from(
    form.querySelectorAll("input, select, textarea, button")
  ).filter((el) => !el.disabled && el.type !== "hidden");

  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const current = document.activeElement;
      const index = focusable.indexOf(current);

      // For textarea: allow Enter if it's multi-line
      if (current.tagName.toLowerCase() === "textarea") {
        return;
      }

      e.preventDefault();

      if (index >= 0 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else {
        form.requestSubmit();
      }
    }
  });
}
