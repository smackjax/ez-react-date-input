import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateInput } from '../';
import './date-input-with-label.style.css';

class DateInputWithLabel extends React.Component{
    state={
        currentOutput: "Select date",
        isValid: true,
    }
    
    handleChange=(result)=>{
        const currentOutput = result.value;

        this.setState({
            currentOutput,
            isValid: result.isValid
        },
        ()=>{
            if(this.props.onChange){
                this.props.onChange(result);
            }
        });
    }

    render(){
        // Fail-safe
        const textValid = (this.state.currentOutput !== "Invalid date");
        const invalidColor = 
            this.state.isValid && textValid ? 
                "" :
            (this.props.invalidColor || "");

        const { onChange, labelText, className, id, ...rest} = this.props;

        const inputClassName = className ? (className + "-input") : "";
        const inputId = id ? (id + "-input") : "";

        return (
            <label 
            id={(this.props.id || "")}
            className={"date-input-label-wrapper " + (this.props.className || "")}>

                <div 
                className="date-output-wrapper">
                    <span 
                    className="date-label-text"
                    >
                    {labelText || ""}
                    </span>

                    <span
                    style={{color: invalidColor}}
                    className="date-value-output"
                    >
                    {this.state.currentOutput}
                    </span>
                </div>
                
                <DateInput
                {...rest}
                id={inputId}
                className={inputClassName}
                onChange={this.handleChange}
                />
            </label>
        )
    }
}

DateInputWithLabel.propTypes={
    labelText: PropTypes.string,
    onChange: PropTypes.func,

    className: PropTypes.string,
    id: PropTypes.string,
    invalidColor: PropTypes.string,

    value: PropTypes.string,
    name: PropTypes.string,
    
    minYear: PropTypes.number,
    maxYear: PropTypes.number,

    inputFormat: PropTypes.string,
    outputFormat: PropTypes.string,
    formFormat: PropTypes.string,

    valueOnMount: PropTypes.bool,
    validateFunc: PropTypes.func
}

export default DateInputWithLabel;