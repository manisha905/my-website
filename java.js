document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const profileForm = document.getElementById('profileForm');
    const profileLink = document.getElementById('profileLink');
    const createPoemButton = document.getElementById('createPoemButton');
    const poemContainer = document.getElementById('poemContainer');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const logoutLink = document.getElementById('logoutLink');
    const changeProfilePhoto = document.getElementById('changeProfilePhoto');
    const profilePhoto = document.getElementById('profilePhoto');

    // Sample data
    let poems = [];
    let users = [];
    let loggedInUser = null;

    // Display sections based on link clicks
    loginLink.addEventListener('click', () => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('signup').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('upload').style.display = 'none';
    });

    signupLink.addEventListener('click', () => {
        document.getElementById('signup').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('upload').style.display = 'none';
    });

    profileLink.addEventListener('click', () => {
        if (loggedInUser) {
            document.getElementById('profile').style.display = 'block';
            document.getElementById('signup').style.display = 'none';
            document.getElementById('login').style.display = 'none';
            document.getElementById('upload').style.display = 'none';
            document.getElementById('profileUsername').value = loggedInUser.username;
            document.getElementById('profileBio').value = loggedInUser.bio;
            if (loggedInUser.profilePhoto) {
                profilePhoto.src = loggedInUser.profilePhoto;
            } else {
                profilePhoto.src = 'default_profile.png';
            }
        } else {
            showAlert('Please log in to view your profile', 'warning');
        }
    });

    createPoemButton.addEventListener('click', () => {
        document.getElementById('upload').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('signup').style.display = 'none';
        document.getElementById('login').style.display = 'none';
    });

    // Handle profile photo change
    changeProfilePhoto.addEventListener('change', () => {
        const file = changeProfilePhoto.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            profilePhoto.src = reader.result;
            if (loggedInUser) {
                loggedInUser.profilePhoto = reader.result;
            }
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    });

    // Handle sign up
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const bio = document.getElementById('signupBio').value;
        const profilePhoto = document.getElementById('signupProfilePhoto').files[0];

        if (users.some(user => user.email === email)) {
            showAlert('Email already in use', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const user = { username, email, password, bio, profilePhoto: reader.result };
            users.push(user);
            signupForm.reset();
            showAlert('Sign up successful. Please log in.', 'success');
            document.getElementById('signup').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        }
        if (profilePhoto) {
            reader.readAsDataURL(profilePhoto);
        } else {
            const user = { username, email, password, bio, profilePhoto: null };
            users.push(user);
            signupForm.reset();
            showAlert('Sign up successful. Please log in.', 'success');
            document.getElementById('signup').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        }
    });

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            loggedInUser = user;
            showAlert('Login successful', 'success');
            loginForm.reset();
            document.getElementById('upload').style.display = 'block';
            loginLink.style.display = 'none';
            signupLink.style.display = 'none';
            logoutLink.style.display = 'block';
            document.getElementById('login').style.display = 'none';
        } else {
            showAlert('Invalid email or password', 'warning');
            document.getElementById('login').style.display = 'block';
            document.getElementById('signup').style.display = 'none';
        }
    });

    // Handle logout
    logoutLink.addEventListener('click', () => {
        loggedInUser = null;
        document.getElementById('upload').style.display = 'none';
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        showAlert('Logged out', 'info');
    });

    // Handle profile update
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (loggedInUser) {
            loggedInUser.username = document.getElementById('profileUsername').value;
            loggedInUser.bio = document.getElementById('profileBio').value;
            showAlert('Profile updated successfully', 'success');
        }
    });

    // Handle poem upload
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!loggedInUser) {
            showAlert('Please log in to upload a poem', 'warning');
            return;
        }

        const title = document.getElementById('title').value;
        const genre = document.getElementById('genre').value;
        const description = document.getElementById('description').value;
        const content = document.getElementById('content').value;

        const poem = { title, genre, description, content, likes: 0, views: 0, author: loggedInUser.username };
        poems.push(poem);
        displayPoems(poems, poemContainer);
        uploadForm.reset();
        showAlert('Poem uploaded successfully', 'success');
    });

    // Display poems
    function displayPoems(poems, container) {
        container.innerHTML = '';
        poems.forEach(poem => {
            const poemDiv = document.createElement('div');
            poemDiv.classList.add('poem');
            poemDiv.innerHTML = `
                <h3>${poem.title}</h3>
                <p><strong>Genre:</strong> ${poem.genre}</p>
                <p>${poem.description}</p>
                <p>${poem.content}</p>
                <p><strong>Author:</strong> ${poem.author}</p>
                <button class="likeButton">Like (${poem.likes})</button>
            `;
            container.appendChild(poemDiv);

            // Handle like button
            poemDiv.querySelector('.likeButton').addEventListener('click', () => {
                if (!loggedInUser) {
                    showAlert('Please log in to like a poem', 'warning');
                    return;
                }
                poem.likes++;
                displayPoems(poems, container);
            });
        });
    }

    // Handle search
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const results = poems.filter(poem => 
            poem.title.toLowerCase().includes(query) || 
            poem.genre.toLowerCase().includes(query) ||
            poem.author.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            const similarUsers = users.filter(user => user.username.toLowerCase().includes(query));
            if (similarUsers.length > 0) {
                similarUsers.forEach(user => {
                    const userPoems = poems.filter(poem => poem.author === user.username);
                    displayPoems(userPoems, poemContainer);
                });
            } else {
                showAlert('No poems or accounts found', 'info');
            }
        } else {
            displayPoems(results, poemContainer);
        }
    });

    // Infinite scroll
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // Load more poems
            displayPoems(poems, poemContainer);
        }
    });

    // Alert function
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.innerHTML = `
            ${message}
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        `;
        document.body.insertBefore(alertDiv, document.body.firstChild);
        setTimeout(() => {
            if (alertDiv) {
                alertDiv.style.display = 'none';
            }
        }, 3000);
    }

    // Initial display
    displayPoems(poems, poemContainer);
});
