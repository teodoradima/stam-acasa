import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams
} from "react-router-dom";
import { Select } from "@code4ro/taskforce-fe-components";

import EvaluationForm from "./evaluationForm";
import EvaluationApi from "../../api/evaluationApi";
import ProfileApi from "../../api/profileApi";

const MemberEvaluation = () => {
  const { personId } = useParams();
  const history = useHistory();
  const [options, setOptions] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    ProfileApi.getDependants().then(setFamilyMembers);
  }, []);

  useEffect(() => {
    setOptions(
      familyMembers.map(person => ({
        text: `${person.name} ${person.surname}`,
        value: person.name,
        selected: person.id === personId
      }))
    );
  }, [personId, familyMembers]);

  const props = {
    onChange: el => {
      const selectedPerson = familyMembers.find(
        person => person.name === el.target.value
      );
      if (selectedPerson) {
        history.replace(`/evaluation/other-members/${selectedPerson.id}`);
      }
    }
  };

  if (!familyMembers.length) {
    return <div> Nu exista alti membri</div>;
  }

  return (
    <>
      <h1 className="member-profile__select">
        <Select label="Alege persoana" selectProps={props} options={options} />
      </h1>
      <Switch>
        {familyMembers.map(member => (
          <Route
            key={member.id}
            path={`/evaluation/other-members/${member.id}`}
          >
            <EvaluationForm
              getForm={EvaluationApi.getEvaluationForm}
              sendResults={results =>
                EvaluationApi.sendEvaluationResults(results, member.id)
              }
            />
          </Route>
        ))}
        {familyMembers.length && (
          <Redirect to={`/evaluation/other-members/${familyMembers[0].id}`} />
        )}
      </Switch>
    </>
  );
};

export default MemberEvaluation;
