from flask import Flask, jsonify, request
import yfinance as yf
from datetime import timedelta
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model

api = Flask(__name__)
api.debug = True

@api.route('/predict', methods=['GET'])  # Use 'GET' instead of 'POST'
def prediction():
    stockSymbol = request.args.get('stockSymbol')
    if not stockSymbol:
        return jsonify({'error': 'No stock symbol provided.'}), 400
    
    # Fetch data using yfinance
    ticker = yf.Ticker(stockSymbol)
    df = ticker.history(period='max')
    df1 = df.reset_index()['Open']  # Use the 'Open' column for predictions

    # Data Preprocessing
    scaler = MinMaxScaler(feature_range=(0, 1))
    df1 = scaler.fit_transform(np.array(df1).reshape(-1, 1))
    test_data = df1[0:len(df1), :1]
    x = len(test_data) - 100
    x_input = test_data[x:].reshape(1, -1)
    
    # Load the pre-trained LSTM model
    model = load_model("lstm_model.h5")
    temp_input = list(x_input)
    temp_input = temp_input[0].tolist()
    lst_output = []
    n_steps = 100
    i = 0
    predictions = {}
    prediction_data = []

    # Get the last date from the dataframe for prediction dates
    last_date = df.index[-1]
    
    while i < 10:
        if len(temp_input) > 100:
            x_input = np.array(temp_input[1:])
            x_input = x_input.reshape(1, -1)
            x_input = x_input.reshape((1, n_steps, 1))
            yhat = model.predict(x_input, verbose=0)
            y_hat = scaler.inverse_transform(yhat)
            predictions_list = y_hat.tolist()
            
            # Calculate the next prediction date
            prediction_date = last_date + timedelta(days=i+2)
            date_str = prediction_date.strftime('%Y-%m-%d')
            
            for prediction in predictions_list:
                prediction_dict = {"date": date_str, "prediction": prediction[0]}
                prediction_data.append(prediction_dict)
            
            temp_input.extend(yhat[0].tolist())
            temp_input = temp_input[1:]
            lst_output.extend(yhat.tolist())
            i += 1
        else:
            x_input = x_input.reshape((1, n_steps, 1))
            yhat = model.predict(x_input, verbose=0)
            temp_input.extend(yhat[0].tolist())
            lst_output.extend(yhat.tolist())
            i += 1

    return jsonify(prediction_data)

if __name__ == '__main__':
    api.run(port=5000)
