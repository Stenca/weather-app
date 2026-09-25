interface Settings {
  units: "metric" | "imperial";
  theme: "light" | "dark";
}
export class SettingsService {
  private key = "weather:settings";

  private defaults: Settings = {
    units: "metric",
    theme: "dark",
  };

  load(): Settings {
    const saved = localStorage.getItem(this.key);
    if (!saved) return { ...this.defaults };
    try {
      return { ...this.defaults, ...JSON.parse(saved) };
    } catch {
      return this.defaults;
    }
  }

  save(settings: Settings): void {
    localStorage.setItem(this.key, JSON.stringify(settings));
  }

  update(patch: Partial<Settings>): Settings {
    const next = { ...this.load(), ...patch };
    this.save(next);
    return next;
  }
}
