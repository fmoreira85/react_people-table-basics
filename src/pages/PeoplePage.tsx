import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPeople } from '../api';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable';
import type { Person } from '../types';

type Status = 'loading' | 'loaded' | 'error';

const preparePeople = (loadedPeople: Person[]) => {
  const peopleWithRelations = loadedPeople.map(person => ({ ...person }));
  const peopleByName = new Map(
    peopleWithRelations.map(person => [person.name, person]),
  );

  return peopleWithRelations.map(person => ({
    ...person,
    mother: person.motherName ? peopleByName.get(person.motherName) : undefined,
    father: person.fatherName ? peopleByName.get(person.fatherName) : undefined,
  }));
};

export const PeoplePage = () => {
  const { slug } = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let isMounted = true;

    getPeople()
      .then(loadedPeople => {
        if (!isMounted) {
          return;
        }

        setPeople(preparePeople(loadedPeople));
        setStatus('loaded');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {status === 'loading' && <Loader />}

          {status === 'error' && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {status === 'loaded' && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {status === 'loaded' && people.length > 0 && (
            <PeopleTable people={people} selectedSlug={slug} />
          )}
        </div>
      </div>
    </>
  );
};
