import classNames from 'classnames';

import type { Person } from '../types';

import { PersonLink } from './PersonLink';

type Props = {
  people: Person[];
  selectedSlug?: string;
};

const renderRelative = (relative: Person | undefined, name: string | null) => {
  if (!name) {
    return '-';
  }

  if (!relative) {
    return name;
  }

  return <PersonLink person={relative} />;
};

export const PeopleTable = ({ people, selectedSlug }: Props) => (
  <table
    data-cy="peopleTable"
    className="table is-striped is-hoverable is-narrow is-fullwidth"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Sex</th>
        <th>Born</th>
        <th>Died</th>
        <th>Mother</th>
        <th>Father</th>
      </tr>
    </thead>

    <tbody>
      {people.map(person => (
        <tr
          key={person.slug}
          data-cy="person"
          className={classNames({
            'has-background-warning': person.slug === selectedSlug,
          })}
        >
          <td>
            <PersonLink person={person} />
          </td>
          <td>{person.sex}</td>
          <td>{person.born}</td>
          <td>{person.died}</td>
          <td>{renderRelative(person.mother, person.motherName)}</td>
          <td>{renderRelative(person.father, person.fatherName)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
