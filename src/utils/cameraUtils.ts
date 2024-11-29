export const checkCameraAvailability = async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');
      if (videoInputs.length === 0) {
        console.warn('No camera devices found.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return false;
    }
  };
