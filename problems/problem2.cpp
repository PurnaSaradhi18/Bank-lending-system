#include<iostream>
#include<cmath>
using namespace std;

string formatIndianCurrency(double num){
  long long intPart = (long long)num;
  double fracPart = num - intPart;

  string digits = "";
  while(intPart > 0){
    digits += (intPart % 10) + '0';
    intPart /= 10;
  }
  if(digits == ""){
    digits = "0";
  }

  string rev = "";
  for(int i = digits.length() - 1; i >= 0; i--){
    rev += digits[i];
  }

  string res = "";
  int n = rev.size();
  int start = n-3;
  if(start < 0){
    start = 0;
  }
  res = rev.substr(start);

  for(int i=start-2; i>=0; i-=2){
    res = rev.substr((i >= 0) ? i : 0,2) + ","+res;
  }

  if(fracPart > 0){
    res += ".";
    for(int i = 0; i < 4; i++){
      fracPart *= 10;
      int digit = (int)fracPart;
      res += (digit + '0');
      fracPart -= digit;
    }
  }
  return res;
}

int main(){
  double num;
  cout << "Enter number: ";
  cin >> num;
  cout << "Formatted Indian Currency: " << formatIndianCurrency(num) << endl;
}