import { useState, useEffect } from "react";
import { db, auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import "./App.css";

const googleProvider = new GoogleAuthProvider();



function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    setUser(result.user);

    alert(`Welcome to ClinicFlow, ${result.user.displayName}!`);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Google sign-in failed: " + error.message);
  }
};

  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");


useEffect(() => {
  async function fetchPatients() {
    try {
      const snapshot = await getDocs(
        collection(db, "patients")
      );

      const savedPatients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPatients(savedPatients);

    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }

  fetchPatients();
}, []);


async function registerPatient(e) {
  e.preventDefault();

  const newPatient = {
    name: name,
    phone: phone,
    reason: reason,
    status: "Waiting",
    queueNumber: Date.now(),
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(
      collection(db, "patients"),
      newPatient
    );

    setPatients((previousPatients) => [
      ...previousPatients,
      {
        ...newPatient,
        id: docRef.id
      }
    ]);

    setName("");
    setPhone("");
    setReason("");

    alert("Patient registered successfully!");

  } catch (error) {
    console.error("Firebase error:", error);
    alert("Patient registration failed: " + error.message);
  }



  setPatients([...patients, newPatient]);

  setName("");
  setPhone("");
  setReason("");
}
  function updatePatient(id) {
    const updatedPatients = patients.map((patient) => {
      if (patient.id === id) {
        return { ...patient, status: "Completed" };
      }

      return patient;
    });

    setPatients(updatedPatients);
  }
if (!user) {
  return (
    <div className="auth-container">
      <h1>ClinicFlow</h1>
      <p>Welcome to your clinic management system.</p>

      <h2>Sign in to continue</h2>

      <button onClick={handleGoogleSignIn}>
        Continue with Google
      </button>
    </div>
  );
}

const handleLogout = async () => {
  try {
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="app-shell">

      <aside className="sidebar">
        <h2>ClinicFlow</h2>

        <nav>
          <p>Overview</p>
          <p>Patients</p>
          <p>Patient Queue</p>
        </nav>

        <small>Reception Staff</small>
      </aside>

      <main className="main-content">

        <header className="topbar">
  <h1>Reception Dashboard</h1>
  <p>Welcome back!</p>

  <button onClick={handleLogout}>
    Logout
  </button>
</header>

        <section className="welcome">
          <div>
            <h2>Manage your patients</h2>
            <p>Register patients and keep track of their visits.</p>
          </div>
        </section>

        <section className="form-panel">
          <h3>Register a new patient</h3>

          <form onSubmit={registerPatient}>

            <div className="form-grid">

              <label>
                Patient name
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>

              <label className="full-width">
                Reason for visit
                <input
                  type="text"
                  placeholder="Why is the patient visiting?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </label>

            </div>

            <button className="primary-button" type="submit">
              Register Patient
            </button>

          </form>
        </section>

        <section className="queue-section">

          <h3>Today's Patient Queue</h3>

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
                <th>Queue No.</th>
              </tr>
            </thead>

            <tbody>

              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No patients registered yet.
                  </td>
                </tr>
              ) : (

                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.reason}</td>
                    <td>{patient.status}</td>
                    <td>{patient.queueNumber}</td>

                    <td>
                      {patient.status === "Waiting" && (
                        <button
                          onClick={() => updatePatient(patient.id)}
                        >
                          Mark completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))

              )}

            </tbody>
          </table>

        </section>

      </main>
    </div>
  );
}

export default App;
