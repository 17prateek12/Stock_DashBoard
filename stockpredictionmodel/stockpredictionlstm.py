import yfinance as yf
import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout, BatchNormalization, GRU, Bidirectional
from sklearn.metrics import mean_squared_error
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.regularizers import l2
from sklearn.model_selection import TimeSeriesSplit
import optuna

# Download data from Yahoo Finance
ticker = 'TSLA'  # Replace with the desired stock symbol
df = yf.download(ticker, period='max', interval='1d')

df.head()

df.tail()

df = df.rename(columns={
    'Open': 'open',
    'High': 'high',
    'Low': 'low',
    'Close': 'close',
    'Adj Close': 'adjClose',
    'Volume': 'volume'
})

df.head()

len(df)

df1=df.reset_index()['open']

plt.plot(df1)

#moving avg
ma100 = df.open.rolling(100).mean()
ma200 = df.open.rolling(200).mean()
ma100,ma200

plt.figure(figsize = (24 ,12))
plt.plot(df.adjClose)
plt.plot(ma100,'g', label ='ma 100')
plt.plot(ma200,'r',label ='ma 200')

scaler=MinMaxScaler(feature_range=(0,1))#data preprocessing LSTM are sensitive to scale of the data  #values b/w 0and 1
df1=scaler.fit_transform(np.array(df1).reshape(-1,1))
print(df1)

##splitting dataset into train and test split
training_size=int(len(df1)*0.75)
test_size=len(df1)-training_size
train_data,test_data=df1[0:training_size,:],df1[training_size:len(df1),:1]
training_size,test_size

# this is for time dependency
def create_dataset(dataset, time_step=1):
	dataX, dataY = [], []
	for i in range(len(dataset)-time_step-1):
		a = dataset[i:(i+time_step), 0]   ###i=0, 0,1,2,3-----99   100
		dataX.append(a)
		dataY.append(dataset[i + time_step, 0])
	return np.array(dataX), np.array(dataY)

time_step = 100
X_train, y_train = create_dataset(train_data, time_step)
X_test, ytest = create_dataset(test_data, time_step)
print(X_train.shape), print(y_train.shape)

print(X_test.shape), print(ytest.shape)

# reshape input to be [samples, time steps, features] which is required for LSTM
X_train =X_train.reshape(X_train.shape[0],X_train.shape[1] , 1) #converting it into 3d
X_test = X_test.reshape(X_test.shape[0],X_test.shape[1] , 1)

"""
model=Sequential()
model.add(LSTM(50,return_sequences=True,input_shape=(X_train.shape[1],1)))
model.add(BatchNormalization())
model.add(LSTM(50,return_sequences=True))
model.add(BatchNormalization())
model.add(LSTM(50))
model.add(BatchNormalization())
model.add(Dense(1))
model.compile(loss='mean_squared_error',optimizer='adam')
"""
#model=Sequential()
#model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
#model.add(Dropout(0.2))
#model.add(BatchNormalization())
#model.add(Dense(1, kernel_regularizer=l2(0.01)))
#
#model.add(LSTM(50, return_sequences=True))
#model.add(Dropout(0.2))
#model.add(BatchNormalization())
#
#model.add(LSTM(50))
#model.add(Dropout(0.2))
#model.add(BatchNormalization())
#
#model.add(Dense(1))
#model.compile(loss='mean_squared_error', optimizer='adam')

def create_model(trial):
    model = Sequential()
    lstm_units = trial.suggest_int('lstm_units', 30, 100)
    dropout_rate = trial.suggest_float('dropout_rate', 0.1, 0.5)
    regularization = trial.suggest_float('regularization', 0.001, 0.01)

    # LSTM Layers
    model.add(LSTM(units=lstm_units, return_sequences=True, input_shape=(X_train.shape[1], 1),
                   kernel_regularizer=l2(regularization)))
    model.add(Dropout(dropout_rate))
    model.add(BatchNormalization())

    # Optional: Add more layers
    model.add(Bidirectional(LSTM(units=lstm_units, return_sequences=True, kernel_regularizer=l2(regularization))))
    model.add(Dropout(dropout_rate))
    model.add(BatchNormalization())

    model.add(GRU(units=lstm_units))
    model.add(Dropout(dropout_rate))
    model.add(BatchNormalization())

    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def objective(trial):
    model = create_model(trial)
    history = model.fit(X_train, y_train, validation_data=(X_test, ytest), epochs=50, batch_size=64, verbose=0)
    val_loss = min(history.history['val_loss'])
    return val_loss

study = optuna.create_study(direction='minimize')
study.optimize(objective, n_trials=20)
best_trial = study.best_trial

print(f"Best trial: {best_trial.values}")
print(f"Best params: {best_trial.params}")

final_model = create_model(optuna.trial.FixedTrial(best_trial.params))

final_model.summary()

early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=0.00001)

history = final_model.fit(X_train, y_train, validation_data=(X_test, ytest), epochs=100, batch_size=64, verbose=1,
                          callbacks=[early_stopping, lr_scheduler])

plt.figure(figsize=(12, 6))
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss During Training and Validation')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
plt.show()

train_predict = final_model.predict(X_train)
test_predict = final_model.predict(X_test)
train_predict = scaler.inverse_transform(train_predict)
test_predict = scaler.inverse_transform(test_predict)

final_model.save("lstm_model.h5")

print(train_predict)

print(test_predict)

y_testreal = ytest
y_testreal = y_testreal.reshape(-1, 1)
y_testreal=scaler.inverse_transform(y_testreal)
print(y_testreal)

train_rmse = math.sqrt(mean_squared_error(y_train, train_predict))
test_rmse = math.sqrt(mean_squared_error(ytest, test_predict))

print(f'Train RMSE: {train_rmse}')
print(f'Test RMSE: {test_rmse}')

look_back = 100
trainPredictPlot = np.empty_like(df1)
trainPredictPlot[:, :] = np.nan
trainPredictPlot[look_back:len(train_predict) + look_back, :] = train_predict

testPredictPlot = np.empty_like(df1)
testPredictPlot[:, :] = np.nan
testPredictPlot[len(train_predict) + (look_back * 2) + 1:len(df1) - 1, :] = test_predict

plt.figure(figsize=(24, 6))
plt.plot(scaler.inverse_transform(df1), label='Actual Data')
plt.plot(trainPredictPlot, label='Train Prediction')
plt.plot(testPredictPlot, label='Test Prediction')
plt.legend()
plt.show()

len(train_data)

len(test_data)

x=len(test_data)-100
print(x)

x_input=test_data[x:].reshape(1,-1)
x_input.shape

temp_input=list(x_input)
temp_input=temp_input[0].tolist()
# temp_input

n=15

lst_output=[]
n_steps=100
i=0
while(i<n):
  if(len(temp_input)>100):
    #print(temp_input)
    x_input=np.array(temp_input[1:])
    # print("{} day input {}".format(i,x_input))
    x_input=x_input.reshape(1,-1)
    x_input = x_input.reshape((1, n_steps, 1))
    #print(x_input)
    yhat = final_model.predict(x_input, verbose=0)
    y_hat = yhat
    y_hat = scaler.inverse_transform(y_hat)
    print("{} day output {}".format(i+1,y_hat))
    temp_input.extend(yhat[0].tolist())
    temp_input=temp_input[1:]
    #print(temp_input)
    lst_output.extend(yhat.tolist())
    i=i+1
  else:
    x_input = x_input.reshape((1, n_steps,1))
    yhat = final_model.predict(x_input, verbose=0)
    # print(yhat[0])
    temp_input.extend(yhat[0].tolist())
    # print(len(temp_input))
    lst_output.extend(yhat.tolist())
    i=i+1

day_new=np.arange(1,101)
day_pred=np.arange(101,101+n)

plt.plot(day_new,scaler.inverse_transform(df1[len(df1)-100:]),label='Trained data')
plt.plot(day_pred, scaler.inverse_transform(lst_output),label='Next 20 days')

#acc
x = math.sqrt(mean_squared_error(y_train,train_predict))
x

type(x)

a = 522.6069 + x
acc= (x/a)*100
acc = 100- acc
print('The accuracy is :')
print(acc)