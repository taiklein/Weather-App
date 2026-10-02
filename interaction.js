let shareLocation = confirm('Allow this website to access your location?')

let search = document.getElementById('search');

    if (shareLocation) {
        search.style.display = 'none';

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
        });
    } else {
        search.style.display = 'block';
    }
