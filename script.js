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
