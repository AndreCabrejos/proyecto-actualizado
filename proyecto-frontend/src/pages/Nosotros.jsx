import React from "react";
import './Nosotros.css';
import team from "../data/teamData";

export default function Nosotros() {
  return (
    <section className="page">
      <h2>Sobre nosotros</h2>
      <p>Streamoria es una plataforma de streaming creada para conectar a streamers y espectadores.</p>

      <div className='team-container'>
        {team.map((member) => (
          <div key={member.id} className='team-member'>
            <img
              src={member.photo}
              alt={'member.name'}
              className="member-photo"
            />
            <h3 className="member-name">{member.name}</h3>
            {member.role && <p className="member-role">{member.role}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
