const video = document.getElementById('mainClip');
const overlay = document.getElementById('overlayStats');

// Example: update overlay based on video time
video.addEventListener('timeupdate', () => {
    const t = video.currentTime;

    if (t < 10) {
        overlay.innerHTML = '<h2></p>';
    } else if (t >= 10 && t < 20) {
        overlay.innerHTML = '<h2></p>';
    } else if (t >= 20) {
        overlay.innerHTML = '<h2></h2>';
    }
});

// Transition to next clip
video.addEventListener('ended', () => {
    // Switch to Geoguessr clip
    video.src = '../media/geoguessr_clip.mp4';
    video.play();
    overlay.innerHTML = '<h2>Geoguessr Adventures!</h2>';
});
