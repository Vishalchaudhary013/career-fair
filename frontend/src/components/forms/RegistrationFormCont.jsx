/**
 * Function is used to create the registration form container.
 */
import RegistrationForm from "./RegistrationForm";

function RegistrationFormCont({registrationClosed }) {
    return(
    <section id="registration" className="d-flex justify-content-center align-items-center my-5 position-relative">
        <div className="w-100 px-3">
          <div className="mx-auto p-4 border rounded bg-white" style={{ maxWidth: "850px" }}>
            {registrationClosed && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(5px)",
                  zIndex: 10,
                }}
              >
                <h4 className="text-danger">
                  Cannot register as the registration date has already passed
                </h4>
              </div>
            )}
            <h3 className="text-center text-primary mb-[30px]">Registration Form</h3>
            <RegistrationForm />
          </div>
        </div>
      </section>
    );
}

export default RegistrationFormCont;
