# Blockvote Fabric Example Network

> This is the "Hello World" of Hyperledger Composer samples, which demonstrates the core functionality of Hyperledger Composer by changing the value of an asset.

This business network defines:

**Participant**
`Regulator`
`Voter`

**Asset**
`Option`
`Poll`

**Transaction**
`vote`
`count`

**Event**
`invalidVote`
`currentResult`
`debug`

**Requirements**
- every invocation must be stored as is
- support different polls with different amount of options
- only pre-registered voters can vote
- voters authenticate by means of signature
- voters can only vote once per poll (no double-votes)
- voters can only vote on polls initiated by its regulator
- invalid votes (not pre-registered, invalid signature, double-vote) must be recorded
- regulators can count the poll

To test this Business Network Definition in the **Test** tab:

Create a `SampleParticipant` participant:

```
{
  "$class": "org.example.basic.SampleParticipant",
  "participantId": "Toby",
  "firstName": "Tobias",
  "lastName": "Hunter"
}
```

Create a `SampleAsset` asset:

```
{
  "$class": "org.example.basic.SampleAsset",
  "assetId": "assetId:1",
  "owner": "resource:org.example.basic.SampleParticipant#Toby",
  "value": "original value"
}
```

Submit a `SampleTransaction` transaction:

```
{
  "$class": "org.example.basic.SampleTransaction",
  "asset": "resource:org.example.basic.SampleAsset#assetId:1",
  "newValue": "new value"
}
```

After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `SampleEvent` has been emitted. As a result, the value of the `assetId:1` should now be `new value` in the Asset Registry.

Congratulations!

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
