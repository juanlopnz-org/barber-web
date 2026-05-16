import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-primary">
          Elegancia y Estilo
        </h1>
        <p className="text-xl text-muted-foreground">
          Reserva tu turno en nuestra barbería premium. La mejor experiencia para tu cuidado personal.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login" className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-8 py-4 bg-secondary text-secondary-foreground border border-border rounded-lg font-semibold text-lg hover:bg-accent transition-colors">
            Crear Cuenta
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card p-6 rounded-xl border border-border">
              <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary text-xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Servicio Premium</h3>
              <p className="text-sm text-muted-foreground">Experimenta un corte de cabello de alta calidad con nuestros expertos.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
