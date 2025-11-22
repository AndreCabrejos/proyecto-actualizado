import "./TyC.css";
export default function TyC() {
  function volver() {
    window.history.back();
  }

  return (
    <section className="page">
      <h2>Términos y Condiciones</h2>
      <p>El uso de Streamoria implica la aceptación de nuestros términos y políticas.</p>
      <p>
        Bienvenido a <strong>Streamoria</strong>, una plataforma digital que ofrece servicios de transmisión (“streaming”) de contenido audiovisual en línea. 
        Al acceder, registrarte o utilizar nuestros servicios, aceptas cumplir con los presentes 
        <strong> Términos y Condiciones de Uso</strong>. Te recomendamos leerlos detenidamente antes de utilizar la plataforma.
      </p>

      <h3>1. Aceptación de los Términos</h3>
      <p>
        Al crear una cuenta o utilizar los servicios de <strong>Streamoria</strong>, reconoces que has leído, entendido y aceptado estos 
        Términos y Condiciones, así como nuestra <strong>Política de Privacidad</strong>. 
        Si no estás de acuerdo con alguno de los términos, no debes usar la plataforma.
      </p>

      <h3 >2. Descripción del Servicio</h3>
      <p>
        <strong>Streamoria</strong> permite a los usuarios acceder, reproducir y disfrutar contenido audiovisual (películas, series, música, 
        transmisiones en vivo y otros) mediante conexión a internet. El acceso puede estar sujeto a un plan gratuito con anuncios 
        o a planes de suscripción de pago.
      </p>

      <h3 >3. Registro y Cuenta de Usuario</h3>
      <ul >
        <li>Para usar <strong>Streamoria</strong>, debes registrarte con información veraz y actualizada.</li>
        <li>Eres responsable de mantener la confidencialidad de tus credenciales.</li>
        <li>Cualquier actividad realizada desde tu cuenta se considerará bajo tu responsabilidad.</li>
        <li><strong>Streamoria</strong> puede suspender o eliminar cuentas que incumplan estos términos o presenten actividad fraudulenta.</li>
      </ul>

      <h3 >4. Uso Permitido</h3>
      <p>
        El uso de <strong>Streamoria</strong> es exclusivamente personal y no comercial. Está prohibido copiar, distribuir o grabar contenido sin autorización, 
        compartir tu cuenta con terceros no autorizados, manipular el servicio o intentar acceder al código fuente o infraestructura, 
        así como utilizar bots o software que interfiera con el funcionamiento normal de la plataforma.
      </p>

      <h3>5. Planes y Pagos</h3>
      <ul >
        <li>Los precios y beneficios de los planes de suscripción se detallan en la plataforma.</li>
        <li>Los pagos se procesan a través de proveedores externos seguros.</li>
        <li>Los cargos recurrentes se aplicarán automáticamente hasta que canceles tu suscripción.</li>
        <li>No se otorgarán reembolsos por periodos ya facturados, salvo disposición legal aplicable.</li>
      </ul>

      <h3 >6. Propiedad Intelectual</h3>
      <p>
        Todo el contenido disponible en <strong>Streamoria</strong> (películas, series, logotipos, diseño, software, etc.) está protegido por derechos de autor 
        y pertenece a <strong>Streamoria</strong> o a sus licenciantes. El usuario obtiene únicamente una licencia limitada y no exclusiva para visualizar el contenido.
      </p>

      <h3>7. Disponibilidad del Servicio</h3>
      <p>
        <strong>Streamoria</strong> no garantiza que el servicio esté disponible de forma continua o libre de errores. 
        Podrán realizarse mantenimientos, actualizaciones o suspensiones temporales sin previo aviso.
      </p>

      <h3 >8. Privacidad y Datos Personales</h3>
      <p>
        El tratamiento de tus datos personales se regula conforme a nuestra <strong>Política de Privacidad</strong>, disponible en la plataforma. 
        Al usar el servicio, autorizas el uso de tus datos para fines operativos y de mejora del servicio.
      </p>

      <h3 >9. Limitación de Responsabilidad</h3>
      <ul >
        <li>Fallos técnicos, interrupciones o pérdidas de datos.</li>
        <li>Daños indirectos derivados del uso del servicio.</li>
        <li>Contenido de terceros disponible en la plataforma.</li>
      </ul>

      <h3 >10. Modificaciones</h3>
      <p>
        <strong>Streamoria</strong> puede modificar estos Términos y Condiciones en cualquier momento. 
        Las versiones actualizadas estarán disponibles en la plataforma, y su uso posterior implicará la aceptación de los cambios.
      </p>

      <h3 >11. Terminación</h3>
      <p>
        <strong>Streamoria</strong> podrá suspender o cancelar tu acceso al servicio si incumples estos términos o si así lo requiere la ley. 
        Podrás cancelar tu cuenta en cualquier momento desde tu perfil.
      </p>

      <h3 >12. Legislación Aplicable</h3>
      <p>
        Estos Términos y Condiciones se regirán por las leyes del país en el que opere <strong>Streamoria</strong>. 
        Cualquier controversia se resolverá ante los tribunales competentes de dicha jurisdicción.
      </p>

      <h3 >13. Contacto</h3>
      <p>
        Si tienes dudas o comentarios sobre estos Términos y Condiciones, puedes comunicarte con nosotros en:{" "}
        <strong>soporte@streamoria.com</strong>
      </p>   
      <button onClick={volver}>← Regresar</button>

    </section>
  );
}