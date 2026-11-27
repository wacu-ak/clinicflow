import { useState, useEffect } from "react";
import { db, auth } from "./firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import "./App.css";


function App() {
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
