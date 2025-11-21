const Person = require('../models/person');

exports.addPerson = async (req, res) => {
    try{
        console.log('addPerson');
        const newPerson = new Person(req.body);
        await newPerson.save();
        res.status(201).json(newPerson);
        console.log('saved person');
    } catch (err){
        res.status(500).json({message: `An error occurred while adding a party member, try again}`});
    }
};

exports.deletePerson = async (req, res) => {
    try{
        console.log('deletePerson');
        const person = await Person.findByIdAndDelete(req.params.id)
        if(!person){
            return res.status(404).json({message: `Could not find person with ID: ${req.params.id}, try again`});
        }

        res.status(200).json({message: `You have successfully deleted ${person.name} from database`});
        console.log('deleted person');
    } catch(err){
        res.status(500).json({message: 'An error occurred while deleting person'});
    }
};

exports.updatePerson = async (req, res) => {
    try{
        const oldPerson = await Person.findById(req.params.id);

        if(!oldPerson){
            return res.status(404).json({message: `A person with ID: ${req.params.id} does not exist, please try again`});
        }

        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        //Placeholder for original data.
        res.status(200).json({message: `You have successfully updated ${updatedPerson.name} in the database`,
        oldData: oldPerson,
        newData: updatedPerson});
    }catch(err){
        res.status(500).json({message: 'An error occurred while updating person'});
    }
}

exports.getAllPeople = async (req, res) => {
    try{
       const persons = await Person.find({});
       res.status(200).json({
           message: 'All persons retrieved',
           count: persons.length,
           data: persons
       });
    } catch (err) {
        res.status(500).json({message: 'An error occurred while getting data for all persons'});
    }
};

exports.getPersonById = async (req, res) => {
    try{
        const person = await Person.findById(req.params.id);
        if(!person){
            return res.status(404).json({message: `Could not find any person with ID: ${req.params.id}, try again`});
        }
        res.status(200).json(person);
    } catch(err){
        res.status(500).json({message: 'An error occurred while getting the person'});
    }
}

exports.getPersonByParty = async (req, res) => {
    try {
        const party = req.params.politicalParty;
        const persons = await Person.find({politicalParty: party});
            if (persons.length === 0) {
                return res.status(404).json({ message: `No members found in ${party}`});
            }
            res.status(200).json({
                party: party,
                count: persons.length,
                data: persons
            });
    } catch (err) {
        res.status(500).json({ message: `An error occurred while finding party members for ${party}`});
    }
};

