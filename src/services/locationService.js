const locationService = {
  requestPermission: async () => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          resolve({ status: result.state === 'granted' ? 'granted' : 'denied' });
        }).catch(() => {
          resolve({ status: 'denied' });
        });
      } else {
        resolve({ status: 'denied' });
      }
    });
  },

  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  },

  watchPosition: (callback) => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.error('Location watch error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
      
      return {
        remove: () => navigator.geolocation.clearWatch(watchId)
      };
    }
    return null;
  }
};

export default locationService;