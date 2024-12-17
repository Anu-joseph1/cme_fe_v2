// src/components/ReportTable.js
import React from 'react';
import './ReportTable.css';

const ReportTable = ({ testData }) => {
  if (!testData) {
    return <div>Loading...</div>; // Show loading state until data is available
  }

    // const testData = [
    //   {
    //     "time_stamp": "1723393000",
    //     "cycle_id": "1",
    //     "axle_sl_no": "AXLE123",
    //     "axle_type": "REAR AXLE 1",
    //     "date_of_testing": "2024-08-20",
    //     "description": "C TEAM F23",
    //     "dwg_no": "0",
    //     "initial_data": {
    //       "housing": 0,
    //       "tem_lh": 0,
    //       "tem_rh": 0
    //     },
    //     "instruments": {
    //       "infrared_thermometer": "PAC/IRS-01,02,03",
    //       "rpm_meter": "PAC/RPM-01,02",
    //       "sound_meter": "PAC/SL-01,05,03"
    //     },
    //     "part_no": "P-RA1-291",
    //     "cycle_steps": {
    //       "cycle_step1": {
    //         "axle_input_speed": 500,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 500,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "08:30",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 500,
    //           "RH": 500
    //         },
    //         "start_time": "08:00"
    //       },
    //       "cycle_step2": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step3": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step4": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step5": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step6": {
    //         "axle_input_speed": 0,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 0,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step7": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step8": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step9": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step10": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       },
    //       "cycle_step11": {
    //         "axle_input_speed": 1000,
    //         "axle_sound_level": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "axle_speed": 1000,
    //         "axle_temperature": {
    //           "housing": 0,
    //           "LH": 0,
    //           "RH": 0
    //         },
    //         "duration": 30,
    //         "end_time": "09:00",
    //         "gear_ratio": 6.332,
    //         "speed": {
    //           "LH": 1000,
    //           "RH": 1000
    //         },
    //         "start_time": "08:30"
    //       }
    //     }
    //   }
    // ]

  return (
    <div className="table-container">
      <table>
        <tbody>
        <tr className='table-info'>
          <td colSpan="4">Part No: {testData[0].part_no}</td>
          <td colSpan="17" style={{ paddingLeft: '100px' }}>
            Initial Temperatures ▶
            <span style={{ marginLeft: '30px' }}>⚪ LH: {testData[0].initial_data.tem_lh}</span>
            <span style={{ marginLeft: '100px' }}>⚪ RH: {testData[0].initial_data.tem_rh}</span>
            <span style={{ marginLeft: '100px' }}>⚪ Housing: {testData[0].initial_data.housing}</span>
          </td>
        </tr>
        <tr className='table-info'>
          <td colSpan="5">Axle Type: {testData[0].axle_type}</td>
          <td colSpan="4">Drawing No: {testData[0].dwg_no}</td>
          <td colSpan="4">Description: {testData[0].description}</td>
          <td colSpan="4">Axle No: {testData[0].axle_sl_no}</td>
          <td colSpan="4">Test Facility: KGF Bangalore</td>
        </tr>
        <tr className='table-titles'>
          <td rowSpan={2}>Step no:</td>
          <td rowSpan={2}>Start Time</td>
          <td rowSpan={2}>End Time</td>
          <td rowSpan={2}>Duration (Minutes)</td>
          <td rowSpan={2}>Axle I/P Speed Specified (RPM)</td>
          <td rowSpan={2}>Axle I/P Set (RPM)</td>
          <td colSpan={4}>
            {"OUTPUT SPEED OF AXLE (RPM)\n(Spec: Gear Ratio < 6.332)".split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </td>
          <td colSpan={4}>
            {"AXLE TEMPERATURE (°C)\n(Spec: 105°C Max)".split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </td>
          <td colSpan={4}>
            {"AXLE SOUND LEVEL (dB)\n(Spec: 96 dB Max)".split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </td>
          <td rowSpan={2}>Check for Oil Leakage</td>
          <td rowSpan={2}>Result</td>
          <td rowSpan={2}>Remarks</td>
        </tr>
        <tr className='table-titles'>
          <td>Instrument Used</td>
          <td>LH</td>
          <td>RH</td>
          <td>Gear Ratio</td>
          <td>Instrument Used</td>
          <td>LH</td>
          <td>RH</td>
          <td>Housing</td>
          <td>Instrument Used</td>
          <td>LH</td>
          <td>RH</td>
          <td>Housing</td>
        </tr>

        {/* Step 1 */}
        {testData[0] && Object.entries(testData[0].cycle_steps).map(([key, step], index) => {
          if (index >= 0 && index <= 4) {
            return (
              <>
              {index === 0 && (
                <tr className='test-type'>
                  <td colSpan="17">FORWARD DIRECTION</td>
                  <td colSpan="4">DATE OF TESTING: {testData[0].date_of_testing}</td>
                </tr>
              )}

              <tr key={index}>
                <td>{index + 1}</td> {/* Step number */}
                <td>{step.start_time}</td>
                <td>{step.end_time}</td>
                <td>{step.duration}</td>
                <td>{step.axle_input_speed}</td>
                <td>{step.axle_speed}</td>
                {index === 0 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.rpm_meter}
                  </td>
                )}
                <td>{step.speed.LH}</td>
                <td>{step.speed.RH}</td>
                <td>{step.gear_ratio}</td>
                {index === 0 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.infrared_thermometer}
                  </td>
                )}
                <td>{step.axle_temperature.LH}</td>
                <td>{step.axle_temperature.RH}</td>
                <td>{step.axle_temperature.housing}</td>
                {index === 0 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.sound_meter}
                  </td>
                )}
                <td>{step.axle_sound_level.LH}</td>
                <td>{step.axle_sound_level.RH}</td>
                <td>{step.axle_sound_level.housing}</td>
                <td>{step.oil_leakage}</td>
                <td>{step.result}</td>
                <td>{step.remarks}</td>
              </tr>
              </>
            );
          } else if (index === 5) {
            return (
              <tr key={index}>
                {/* Render specific cells for index 5 */}
                <td>{index + 1}</td>
                {/* Add other cells specific to index 5 here */}
                <td>{step.start_time}</td>
                <td>{step.end_time}</td>
                <td>{step.duration}</td>
                <td>{step.axle_input_speed}</td>
                <td>{step.axle_speed}</td>
                <td colSpan={17}>note: cooling cycle</td>
              </tr>
            );
          } else if (index >= 6 && index <= 10) {
            return (
              <>
              {index === 6 && (
                <tr className='test-type'>
                  <td colSpan="17">REVERSE DIRECTION</td>
                  <td colSpan="4">DATE OF TESTING: {testData[0].date_of_testing}</td>
                </tr>
              )}
              <tr key={index}>
                
                <td>{index + 1}</td> {/* Step number */}
                <td>{step.start_time}</td>
                <td>{step.end_time}</td>
                <td>{step.duration}</td>
                <td>{step.axle_input_speed}</td>
                <td>{step.axle_speed}</td>
                {index === 6 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.rpm_meter}
                  </td>
                )}
                <td>{step.speed.LH}</td>
                <td>{step.speed.RH}</td>
                <td>{step.gear_ratio}</td>
                {index === 6 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.infrared_thermometer}
                  </td>
                )}
                <td>{step.axle_temperature.LH}</td>
                <td>{step.axle_temperature.RH}</td>
                <td>{step.axle_temperature.housing}</td>
                {index === 6 && (
                  <td rowSpan={5}>
                    {testData[0].instruments.sound_meter}
                  </td>
                )}
                <td>{step.axle_sound_level.LH}</td>
                <td>{step.axle_sound_level.RH}</td>
                <td>{step.axle_sound_level.housing}</td>
                <td>{step.oil_leakage}</td>
                <td>{step.result}</td>
                <td>{step.remarks}</td>
              </tr>
              </>
            );
          }
          
          return null;
        })}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
