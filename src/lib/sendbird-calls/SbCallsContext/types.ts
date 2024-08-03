import type {
  DirectCall,
  LocalParticipant,
  Participant,
  RemoteParticipant,
  Room
} from 'sendbird-calls';

// TODO: 'idle' state
export type CallState = 'dialing' | 'ringing' | 'established' | 'connected' | 'reconnecting' | 'reconnected' | 'ended';

export type AudioInputDeviceInfo = {
  current?: InputDeviceInfo;
  available: InputDeviceInfo[];
}
export type AudioOutputDeviceInfo = {
  current?: MediaDeviceInfo;
  available: MediaDeviceInfo[];
}
export type VideoInputDeviceInfo = {
  current?: InputDeviceInfo;
  available: InputDeviceInfo[];
}

export interface StatefulDirectCall extends DirectCall {
  callState: CallState;
}

export interface StatefulRoom extends Pick<
  Room,
  | 'roomId'
  | 'roomType'
  | 'createdAt'
  | 'createdBy'
  | 'enter'
  | 'exit'
> {
  participants: StatefulParticipant[];
  localParticipant: StatefulLocalParticipant;
  remoteParticipants: StatefulRemoteParticipant[];
}

export interface StatefulParticipant extends Pick<
  Participant,
  | 'participantId'
  // | 'isLocalParticipant'
  | 'enteredAt'
  | 'updatedAt'
  | 'exitedAt'
  | 'duration'
  | 'state'
  | 'user'
  | 'isAudioEnabled'
  | 'isVideoEnabled'
  | 'setMediaView'
> {

}

// TODO: Fix types
export interface StatefulLocalParticipant extends StatefulParticipant, Pick<
  LocalParticipant,
  | 'isLocalParticipant'
  | 'setLocalMediaView'
  | 'muteMicrophone'
  | 'unmuteMicrophone'
  | 'stopVideo'
  | 'startVideo'
> {

}

// TODO: Fix types
export interface StatefulRemoteParticipant extends StatefulParticipant, Pick<
  RemoteParticipant,
  | 'isLocalParticipant'
> {

}
