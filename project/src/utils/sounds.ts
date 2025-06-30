// Sistema de sonidos mejorado para el restaurante
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private volume: number = 0.7;
  private enabled: boolean = true;

  private constructor() {
    this.initializeSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    const soundFiles = {
      newOrder: '/sounds/kitchen-bell.mp3',
      orderReady: '/sounds/order-ready.mp3',
      success: '/sounds/success-chime.mp3',
      notification: '/sounds/gentle-notification.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  public play(soundName: string): Promise<void> {
    if (!this.enabled) return Promise.resolve();

    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`Sonido no encontrado: ${soundName}`);
      return Promise.resolve();
    }

    // Reset audio to beginning
    sound.currentTime = 0;
    
    return sound.play().catch(error => {
      console.warn(`Error reproduciendo sonido ${soundName}:`, error);
    });
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

export const soundManager = SoundManager.getInstance();