import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

export default function SearchBar({ isSearching, onSearch }) {
    const [input, setInput] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        setInput(input.trim());
        onSearch(input);
    }

    const onKeyPress = e => {
        if (e.code === 'Enter')
            handleSubmit(e);
    }

    return (
        <Form
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "600px" }}>
            <Form.Group>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                            search-icon
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        disabled={isSearching}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={!isSearching ? onKeyPress : null}
                        value={input}
                        type="text" />
                </InputGroup>
                <InputGroup className="d-flex align-item justify-content-center">
                    <Button
                        disabled={isSearching}
                        style={{ marginTop: "1em" }}
                        variant="primary"
                        type="submit">
                        {!isSearching ? 'Search Documents' : 'loading-icon'}
                    </Button>
                </InputGroup>
            </Form.Group>
        </Form>
    )
}
