import React, { Component } from 'react';
import MessageInput from './MessageInput';
import NameInput from './NameInput';
import MessageFormatter from './MessageFormatter';

//const URL = 'ws://localhost:3030';
const URL = 'wss://shoutbox-metadata-backend.herokuapp.com';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      messages: [],
      wsConnected: false,
    };

    this.ws = new WebSocket(URL);

    this.addMessage.bind(this);
    this.submitMessage.bind(this);
  }

  componentDidMount() {
    // Connect client
    this.ws.onopen = () => {
      this.setState({ wsConnected: true });
      console.log('WS connected');
    };

    // When receiving a message
    this.ws.onmessage = e => {
      const message = JSON.parse(e.data);
      this.addMessage(message);
    };

    // When connection closes
    this.ws.onclose = () => {
      this.setState({ wsConnected: false });
      console.log('WS disconnected');
      // Try to reconnect
      this.setState({
        ws: new WebSocket(URL)
      });
    };
  }

  addMessage(message) {
    this.setState(state => ({ messages: [...state.messages, message] }));
  }

  submitMessage(messageString) {
    // on submitting the MessageSend form, send the message, add it to the list and reset the input
    const message = { 
      name: this.state.name, 
      message: messageString 
    };
    this.ws.send(JSON.stringify(message));
  }

  render() {
    return (
      <div className="sbMainWrapper">
        <div className="sbMessageArea">
          {this.state.messages.map((message, index) => (
            <MessageFormatter
              key={index}
              message={message.message}
              name={message.name}
            />
          ))}
          {!this.state.wsConnected && <div className="sbNotConnectedText">Ei yhteyttä chat-palvelimeen</div>}
        </div>
        <div className="sbInputArea">
          {this.state.name
            ? <MessageInput
              ws={this.ws}
              onSubmitMessage={(messageString) =>
                this.submitMessage(messageString)
              }
            />
            : <NameInput
              ws={this.ws}
              onSubmitName={(name) =>
                this.setState({ name: name })
              }
            />}
        </div>
      </div>
    );
  }
}

export default Chat;
