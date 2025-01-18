import React from 'react';
import '../Styles/DatasetInfo.css';

const DatasetInfo = () => {
  return (
    <div className="dataset-info">
      <h2>Skup podataka o vozačima Formule 1</h2>
      <p>Ovaj skup podataka sadrži informacije o nekim od najvećih vozača u povijesti Formule 1, zajedno s podacima o
        njihovim timovima. Skup podataka uključuje detalje poput broja prvenstava, pobjeda, postolja, i drugih važnih
        statističkih podataka. Ove informacije mogu biti korisne za analizu uspjeha vozača i timova te za povijesna
        istraživanja unutar svijeta Formule 1.</p>
      <h3>Metapodaci</h3>
      <ul>
        <li><strong>Opis otvorene licencije:</strong> MIT License (Omogućuje korisnicima da slobodno koriste,
          modificiraju i distribuiraju softver, pod uvjetom da se u svim kopijama ili značajnim dijelovima softvera
          uključi izjava o autorskim pravima i odricanje od odgovornosti)
        </li>
        <li><strong>Naziv autora:</strong> Bruno Jurakić</li>
        <li><strong>Verzija skupa podataka:</strong> 1.0</li>
        <li><strong>Jezik podataka:</strong> Engleski</li>
        <li><strong>Opis atributa:</strong></li>
        <ul>
          <li><strong>name:</strong> Ime vozača</li>
          <li><strong>surname:</strong> Prezime vozača</li>
          <li><strong>nationality:</strong> Nacionalnost vozača</li>
          <li><strong>wins:</strong> Broj pobjeda vozača</li>
          <li><strong>podiums:</strong> Broj postolja vozača</li>
          <li><strong>poles:</strong> Broj pole pozicija vozača</li>
          <li><strong>points:</strong> Ukupni bodovi vozača</li>
          <li><strong>championships:</strong> Broj osvojenih prvenstava vozača</li>
          <li><strong>races_done:</strong> Broj odrađenih utrka vozača</li>
          <li><strong>status:</strong> Status vozača (aktivni/mirovina)</li>
          <li><strong>current_team:</strong> Informacije o trenutnom timu vozača</li>
          <ul>
            <li><strong>name:</strong> Ime tima</li>
            <li><strong>country:</strong> Država tima</li>
            <li><strong>founded_year:</strong> Godina osnivanja tima</li>
            <li><strong>championships_won:</strong> Broj osvojenih prvenstava od strane tima</li>
          </ul>
        </ul>
        <li><strong>Datum kreiranja skupa podataka:</strong> 22.10.2024.</li>
        <li><strong>Izvor podataka:</strong> Izvorni podaci prikupljeni iz raznih sportskih izvora i statističkih baza
          podataka
        </li>
        <li><strong>Tip skupa podataka:</strong> Kataloški</li>
        <li><strong>Namjena skupa podataka:</strong> Analiza performansi vozača i timova u Formuli 1</li>
        <li><strong>Potencijalne primjene:</strong> Vizualizacija podataka, analize uspješnosti, sportske analize i
          istraživanja
        </li>
      </ul>
    </div>
  );
};

export default DatasetInfo;