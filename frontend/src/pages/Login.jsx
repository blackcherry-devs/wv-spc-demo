import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales incorrectas. Verifique usuario o contraseña');
    }
  };

  return (
    <div className="bg-surface h-screen flex flex-col overflow-hidden w-full font-sans">


      {/* Header */}
      <header className="bg-primary-container h-12 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white p-0.5 rounded-sm">
            <img alt="VW Logo" className="h-6 w-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA11ANjWq1wTC7VNWOezYljeb5baOUd_R6SRFjEvvZwml7nG3EfFC6Q2F9CiYWmEjBoA2oNkMsO9U4uTXbij9_dNXDntexXQnobJAgGiGYUH5cjpGlSO4vp6bPPka6W3GCjaHhZKuFXPwPplM_BLCMSZGkQ9ibz_5t8IK9WI1FCQM1LHImUem5oE348XJrBMI3fC1U5uJimnh7PkzLJQSjWxyDqkkr5vSOF5rJBcTcyidam9dFiKcndOYA0EbCjjpvrAYNQVydFTX3F"/>
          </div>
          <span className="text-white font-title-md text-sm md:text-base tracking-tight">Sistema de Control Estadístico de Procesos</span>
        </div>
        <div className="text-white font-label-md text-[10px] tracking-widest opacity-80">
            ACCESO RESTRINGIDO
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden h-0">
        
        {/* Left Side: Login Form */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-gutter md:p-8 bg-surface overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-outline-variant p-8 rounded-panel shadow-sm relative">
            <div className="mb-8">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary-container mb-2">Iniciar Sesión</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Ingrese sus credenciales de empleado para continuar</p>
            </div>
            
            {error && (
              <div className="mb-4 bg-error-container text-on-error-container p-3 rounded-md text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2 group">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider" htmlFor="employee_id">Número de Empleado (Email)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary">badge</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md text-body-md" 
                    id="employee_id" 
                    name="employee_id" 
                    placeholder="admin@vw.com" 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary">lock</span>
                  <input 
                    className="w-full pl-10 pr-12 py-3 bg-white border border-outline rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md text-body-md" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline text-primary-container focus:ring-primary-container" type="checkbox"/>
                  <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Recordarme</span>
                </label>
                <a className="font-label-md text-label-md text-secondary hover:underline" href="#">¿Olvidó su contraseña?</a>
              </div>

              <button 
                className="w-full bg-primary-container text-white py-4 rounded-lg font-title-md text-title-md hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" 
                type="submit"
              >
                Iniciar Sesión
                <span className="material-symbols-outlined">login</span>
              </button>
            </form>

            <div className="mt-8 border-t border-outline-variant pt-6">
              <details className="group cursor-pointer">
                <summary className="flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors outline-none">
                  <span className="mr-2">Demo Credentials</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-4 space-y-3 text-sm bg-surface-container p-4 rounded-lg border border-outline-variant">
                  <div>
                    <p className="font-semibold text-primary">Admin Profile</p>
                    <p className="font-mono text-on-surface-variant bg-surface-variant px-2 py-1 rounded inline-block mt-1">admin@vw.com</p>
                    <p className="font-mono text-on-surface-variant bg-surface-variant px-2 py-1 rounded inline-block mt-1 ml-2">PasswordAdmin123</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Operator Profile</p>
                    <p className="font-mono text-on-surface-variant bg-surface-variant px-2 py-1 rounded inline-block mt-1">op12@vw.com</p>
                    <p className="font-mono text-on-surface-variant bg-surface-variant px-2 py-1 rounded inline-block mt-1 ml-2">PasswordOp123</p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Right Side: Corporate Panel */}
        <section className="w-full md:w-1/2 p-4 md:p-6 bg-surface flex overflow-hidden">
          <div className="w-full h-full bg-primary-container flex items-center justify-center rounded-[48px] md:rounded-[64px] rounded-tl-[80px] md:rounded-tl-[120px] shadow-lg relative">
            <div className="w-full h-full flex flex-col p-12 md:p-20">
              <div className="flex-grow flex items-center justify-center mb-12">
                <img alt="Volkswagen Logo" className="w-full object-contain opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVRzR0llsFueiSAsvu0V9MD5KphOCFBX7fDOEdOqTFi5ax3RDDhSppWrFXVvr_Jd0Dum_HmLqoUKiIrpyWAPMXjHkqg4IkFRULNao8B9YDyfhJxthvDW2kgYoOa43sVAdQIXYnCK0DoKGRoAaifbOHcKPS_pFIwqBsg6vczKlxOkZH_F4b-eRD0JhImtLBTFNPHVo9spgbFH7-ABhoR1Cqxv4CCJJ66r3glhb3tUACCi5b6f8QjIn01u8waGVfVXqsP2rHqXfTuYk" style={{maxWidth: '600px', width: '100%'}}/>
              </div>
              <div className="mb-8 relative z-10">
                <h1 className="text-white font-display-lg text-3xl md:text-5xl font-bold leading-tight max-w-lg">
                  Sistema de Control Estadístico de Procesos
                </h1>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant px-gutter py-4 shrink-0">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <span className="font-code-data text-xs text-on-surface-variant/60 tracking-wider">V5.0.0-PRD</span>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1">
              <span className="font-code-data text-xs text-on-surface-variant font-bold uppercase tracking-widest italic">SOLO PARA USO INTERNO</span>
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="font-body-md text-[11px] text-on-surface-variant/80 leading-tight uppercase tracking-tight">SOLO PERSONAL AUTORIZADO, TODAS LAS ACTIVIDADES DE LA SESIÓN SON REGISTRADAS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
