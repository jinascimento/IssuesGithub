import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import { Form, SubmitButton, List, SpanError, InputRepository } from './styles';
import Container from '../../components/Container/index';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    errorSubmit: '',
  };

  // Carrega dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  HandleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  renderError = msg => {
    this.setState({ errorSubmit: msg });
  };

  handleSubmit = async e => {
    try {
      e.preventDefault();
      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      if (data) {
        repositories.forEach(e => {
          if (e.name === data.name) {
            throw new Error('Repositório duplicado');
          }
        });
      }

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (e) {
      if (e.message === 'Repositório duplicado') {
        this.setState({ loading: false });
        return this.renderError(e.message);
      }
      if (e.response.status === parseInt('404')) {
        console.log(e.message)
        this.renderError('Repositório não encontrado');
        this.setState({ loading: false });
      }
    }
  };

  render() {
    const { newRepo, loading, repositories, errorSubmit } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <InputRepository
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.HandleInputChange}
            error={errorSubmit}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <SpanError className="error-message">{errorSubmit}</SpanError>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
