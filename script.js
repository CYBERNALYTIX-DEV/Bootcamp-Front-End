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

//close dropdown when any nav link is clicked
document.querySelectorAll('.drop-down a').forEach(link => {
  link.addEventListener('click', () => {
    dropdown.style.display = 'none';
    dropdown.classList.remove('show');
    icon.src = 'images/menu.svg';
  });
});

//close dropdown when clicking outside menu
document.addEventListener('click', () => {
  const clickedInsideMenu = dropdown.contains(event.target);
  const clickedMenuIcon = icon.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuIcon && dropdown.classList.contains('show')) {
    dropdown.style.display = 'none';
    dropdown.classList.remove('show');
    icon.src = 'images/menu.svg';
  }
});

//get data from register form
document.getElementById('bootcampForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = this;
  const formData = new FormData(form);
  const data = {
    fullname: formData.get('fullname'),
    tel: formData.get('tel'),
    email: formData.get('email'),
    gender: formData.get('gender'),
    residence: formData.get('residence'),
    employment: formData.get('employment'),
    proficiency: formData.get('proficiency'),
    motivation: formData.get('motivation'),
    expectation: formData.get('expectation'),
    experience: formData.get('experience'),
    referer: formData.get('referer'),
    session: formData.get('session'),
    certificate: formData.get('certificate')
  };

  console.log('Submitted Data', data);
  alert('your response has been received');
  form.reset();
});