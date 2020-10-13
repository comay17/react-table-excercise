import React from "react";
import GenericTable from './GenericTable';
import SearchBar from "material-ui-search-bar";

const EXCLUDED_COLUMNS = ['tags', 'logs']

class SpansTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      spans: [],
      filteredSpans: [],
      searchPhrase: ''
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/spans/")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            spans: result,
            filteredSpans: result
          });
        },
        (error) => {
          this.setState({
            error: error
          })
        }
      );
  }

  handleSearch() {
    const parsedPhrase = this.state.searchPhrase.split(' ');
    const column = parsedPhrase[0];
    const action = parsedPhrase[1];
    const values = parsedPhrase.slice(2);

    const updatedFilteredSpans = this.state.spans.filter(s => this.searchInSpan(s, column, action, values));

    this.setState({
      filteredSpans: updatedFilteredSpans
    });
  }

  searchInSpan(span, column, action, values) {
    switch (action) {
      case ">":
        return span[column] > values[0];
      case "<":
        return span[column] < values[0];
      case "=":
        return span[column].toString() === values[0];
      case "includes-some":
        return values.some((searchVal) =>
          (typeof span[column] === "object"
            ? JSON.stringify(span[column])
            : span[column].toString()
          ).includes(searchVal)
        );
      case "includes-all":
        return values.every((searchVal) =>
          (typeof span[column] === "object"
            ? JSON.stringify(span[column])
            : span[column].toString()
          ).includes(searchVal)
        );
      default:
        return false;
    }
  }

  render() {
    const columns = this.state.spans.length > 0 ?
    Object.keys(this.state.spans[0]).filter(c => !EXCLUDED_COLUMNS.includes(c)): [];
    return (
      <div className="spans-table">
        <SearchBar
          className="search-bar"
          value={this.state.searchPhrase}
          onChange={(newVal) => this.setState({ searchPhrase: newVal })}
          onRequestSearch={() => this.handleSearch()}
          onCancelSearch={() => this.setState({ filteredSpans: this.state.spans })}
        />
        <GenericTable
          columns={columns}
          data={this.state.filteredSpans}
          keyColumn={"spanId"}
        />
      </div>
    );
  }
}

export default SpansTable;