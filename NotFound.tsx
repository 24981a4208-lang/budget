@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Grotesk:wght@500;600;700&display=swap');

@layer base {
  :root {
    --background: 150 20% 97%;
    --foreground: 160 30% 10%;

    --card: 0 0% 100%;
    --card-foreground: 160 30% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 160 30% 10%;

    --primary: 162 63% 41%;
    --primary-foreground: 0 0% 100%;

    --secondary: 160 20% 93%;
    --secondary-foreground: 160 30% 15%;

    --muted: 150 15% 92%;
    --muted-foreground: 160 10% 45%;

    --accent: 38 92% 50%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;

    --info: 210 80% 55%;
    --info-foreground: 0 0% 100%;

    --border: 160 15% 88%;
    --input: 160 15% 88%;
    --ring: 162 63% 41%;

    --radius: 0.75rem;

    --chart-1: 162 63% 41%;
    --chart-2: 38 92% 50%;
    --chart-3: 210 80% 55%;
    --chart-4: 0 72% 51%;
    --chart-5: 280 60% 55%;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;

    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

@layer utilities {
  .glass-card {
    @apply bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg;
  }

  .gradient-primary {
    background: linear-gradient(135deg, hsl(162, 63%, 41%), hsl(170, 70%, 35%));
  }

  .gradient-accent {
    background: linear-gradient(135deg, hsl(38, 92%, 50%), hsl(28, 90%, 55%));
  }

  .gradient-hero {
    background: linear-gradient(160deg, hsl(162, 63%, 95%), hsl(150, 20%, 97%) 40%, hsl(38, 92%, 97%));
  }

  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(162, 63%, 35%), hsl(170, 70%, 30%));
  }

  .step-active {
    @apply bg-primary text-primary-foreground shadow-md;
    box-shadow: 0 4px 14px -3px hsl(162 63% 41% / 0.4);
  }

  .step-completed {
    @apply bg-primary/20 text-primary border-primary/30;
  }

  .step-inactive {
    @apply bg-muted text-muted-foreground;
  }

  .stat-card {
    @apply glass-card rounded-xl p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5;
  }

  .alert-warning {
    @apply bg-accent/10 border-accent/30 text-accent-foreground;
    color: hsl(38, 70%, 30%);
  }

  .alert-danger {
    @apply bg-destructive/10 border-destructive/30;
    color: hsl(0, 60%, 40%);
  }

  .alert-success {
    @apply border-primary/30;
    background: hsl(142, 71%, 45%, 0.1);
    color: hsl(142, 50%, 25%);
  }
}
