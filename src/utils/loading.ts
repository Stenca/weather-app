export class LoadingController {
  private timer: number | null = null;
  private onChange: (loading: boolean) => void;

  constructor(onChange: (loading: boolean) => void) {
    this.onChange = onChange;
  }

  begin(delayMs = 150): void {
    if (this.timer !== null) clearTimeout(this.timer);

    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.onChange(true);
    }, delayMs);
  }

  end(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.onChange(false);
  }
}
